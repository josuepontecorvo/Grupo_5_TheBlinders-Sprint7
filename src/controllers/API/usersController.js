const path = require('path');
const fs = require('fs');
const {validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const { User, Role } = require('../../dataBase/models');


controlador = {
    list: async (req,res) =>{ 

        try {
            let data; 
            // Page number < 1
            if (req.query.page <= 0) {

                let respuesta = {
                    meta : {
                        status : 400,
                        url : `/api/usuarios${req.url}`,
                    },
                    data : 'El número de página debe ser mayor o igual a 1'
                } 
                return res.status(400).json(respuesta);

            } else if (req.query.page > 0) {

                data =  await User.findAndCountAll({
                    attributes: ['id','firstName','lastName','email','image'],
                    limit: 10,
                    offset: (req.query.page - 1) * 10,
                })

            } else {

                data =  await User.findAndCountAll({
                    attributes: ['id','firstName','Lastname','email','image'],
                })

            }

            let users = [...data.rows];
            let total = data.count;
            // The page number require is greater than the pages available. 
            if (req.query.page && req.query.page > Math.ceil(total/10) ) {

                let respuesta = {
                    meta : {
                        status : 400,
                        url : `/api/usuarios${req.url}`,
                    },
                    data : 'El número de páginas disponibles es: ' + Math.ceil(total/10)
                } 
                return res.status(400).json(respuesta);

            };

            users = users.map(user => {
                return {
                    id: user.id,
                    name: `${user.firstName} ${user.lastName}`,
                    email: user.email,
                    detail: `/api/usuarios/${user.id}`,
                };
            });
            
            
            let respuesta = {
                meta : {
                    status : 200,
                    total : users.length,
                    url : `/api/usuarios${req.url}`,
                    next: (req.query.page && req.query.page * 10 < total) ? `/api/usuarios/?page=${+req.query.page + 1}` : '',
                    previous: +req.query.page > 1 ? `/api/usuarios/?page=${+req.query.page - 1}` : ''
                },
                data : users
            } 

            res.status(200).json(respuesta);

        } catch (error) {
            res.json(error.message);
        }
        
    },

    detail: async (req,res) => { 
        try {
            
            const id = +req.params.id;
            const data = await User.findByPk(id);
            const user = await data?.toJSON();
            delete user?.password;
            delete user?.roleId;
            delete user?.RoleId;
            
            if (user) {
                user.image = `/images/users/${user.image}`;
                let respuesta = {
                    meta : {
                        status : 200,
                        url : `/api/usuarios/${user.id}`,
                    },
                    data : user
                } 
                res.status(200).json(respuesta);
            } else {
                let respuesta = {
                    meta : {
                        status : 404,
                        url : `/api/usuarios/${req.params.id}`,
                    },
                    data : 'Usuario no encontrado'
                } 
                res.status(404).json(respuesta);
            }
            

        } catch (error) {
            res.json(error.message);
        }
        
        
    },

    store: async (req,res) => {
        try {
            if (req.body.id) {
                let respuesta = {
                    meta : {
                        status : 400,
                        url : `/api/usuarios/crear`,
                    },
                    data : 'No puede enviar el id en el body'
                } 
                return res.status(400).json(respuesta);
            }

            let newUser = req.body;
            let errors = validationResult(req);
            // There are not validations errors 
            if (errors.isEmpty()) {
                // Email is unavailable (another user has the same email)
                if (await User.findOne({where:{'email' : req.body.email}})){

                    let errors = {
                            msg : 'Email existente'
                    }
                    
                    let respuesta = {
                        meta : {
                            status : 400,
                            url : `/api/usuarios/crear`,
                        },
                        data : errors.msg
                    } 
                    res.status(400).json(respuesta);

                // Email is available -> create new user
                } else {

                    newUser.image = req.file?.filename ? req.file.filename : 'default-user.png';
                    newUser.password = bcrypt.hashSync(newUser.password,10);
                    let user = await User.create({
                        ...newUser
                    })
                    user = await user.toJSON();
                    delete user.password;
                    delete user?.roleId;
                    delete user?.RoleId;

                    let respuesta = {
                        meta : {
                            status : 201,
                            url : `/api/usuarios/${user.id}`,
                        },
                        data : user
                    } 
                    res.status(201).json(respuesta);

                }
            // There are validations errors 
            } else {
                let respuesta = {
                    meta : {
                        status : 400,
                        url : `/api/usuarios/crear`,
                    },
                    data : errors.mapped()
                } 
                res.status(400).json(respuesta);

            };

        } catch (error) {
            res.json(error.message);
        }
        
    },

    update: async (req,res) => {

        try {

            let idToUpdate = req.params.id;
            const userToUpdate = await User.findByPk(idToUpdate);  

            if (!userToUpdate) {
                let respuesta = {
                    meta : {
                        status : 404,
                        url : `/api/usuarios/editar/${req.params.id}`,
                    },
                    data : 'Usuario no encontrado'
                } 
                return res.status(404).json(respuesta);
    
    
            } else if (req.body.id) {
                let respuesta = {
                    meta : {
                        status : 400,
                        url : `/api/usuarios/editar/${req.params.id}`,
                    },
                    data : 'No puede enviar el id en el body'
                } 
                return res.status(400).json(respuesta);
            }

            let errors = validationResult(req);
            // There are not validations errors
            if (errors.isEmpty()) {
                // The user changed the email and the new email is in used by another user
                const emailVerification = await User.findOne({where: { 'email': req.body.email }})
                if (userToUpdate.email !== req.body.email && emailVerification) {

                    if (req.file) {
                        fs.unlinkSync(path.resolve(__dirname, '../../public/images/users/'+req.file.filename))
                    };

                    let errors = {
                            msg : 'Email no disponible'
                    }
                    let respuesta = {
                        meta : {
                            status : 400,
                            url : `/api/usuarios/editar/${idToUpdate}`,
                        },
                        data : errors.msg
                    } 
                    return res.status(400).json(respuesta);

                }
                // The user changed the email and the new email is not in use by another user or the user didn´t change the email.
                let dataUpdate = req.body;
                dataUpdate.image = req.file?.filename ? req.file.filename : userToUpdate.image;
                // The user changed the image
                // if (userToUpdate.image != dataUpdate.image ) {
                //     fs.unlinkSync(path.resolve(__dirname, '../../public/images/users/'+userToUpdate.image));
                // };
                 // The user changed the password
                if(dataUpdate.password) {

                    let userUpdate = {
                        ...dataUpdate,
                    }
                    userUpdate.password = bcrypt.hashSync(userUpdate.password,10);
                    await User.update({...userUpdate},{where: {id: idToUpdate}});
                    delete userUpdate.password;
                    userUpdate.id = idToUpdate;

                    let respuesta = {
                        meta : {
                            status : 200,
                            url : `/api/usuarios/editar/${userUpdate.id}`,
                        },
                        data : userUpdate
                    } 
                    res.status(200).json(respuesta);
                // The user didn´t change the password        
                } else {

                    dataUpdate.password = userToUpdate.password;
                    let userUpdate = {
                        ...dataUpdate,
                    }
                    await User.update({...userUpdate},{where: {id: idToUpdate}});
                    delete userUpdate.password;
                    userUpdate.id = idToUpdate;

                    let respuesta = {
                        meta : {
                            status : 200,
                            url : `/api/usuarios/editar/${userUpdate.id}`,
                        },
                        data : userUpdate
                    } 
                    res.status(200).json(respuesta);
                }

            // There are validations errors
            } else {
                if (req.file) {
                    fs.unlinkSync(path.resolve(__dirname, '../../public/images/users/'+req.file.filename))
                };


                let respuesta = {
                    meta : {
                        status : 400,
                        url : `/api/usuarios/editar/${idToUpdate}`,
                    },
                    data : errors.mapped()
                } 
                res.status(400).json(respuesta);
            }

        } catch (error) {
            res.json(error.message)
        }
        
    },

    delete: async (req,res) => {
        try {

            let idToDelete = req.params.id;
            let data = await User.findByPk(idToDelete);
            const user = await data?.toJSON();
                delete user?.password;
                delete user?.roleId;
                delete user?.RoleId;

            // let pathToImage = path.join(__dirname, '../../public/images/users/'+ user.image);
            // fs.unlinkSync( pathToImage );
            if (user) {
                await User.destroy({where:{"id": idToDelete}});

                let respuesta = {
                    meta : {
                        status : 200,
                        url : `/api/usuarios/eliminar/${user.id}`,
                    },
                    data : user
                } 
                res.status(200).json(respuesta);


            } else {
                let respuesta = {
                    meta : {
                        status : 404,
                        url : `/api/usuarios/eliminar/${req.params.id}`,
                    },
                    data : 'Usuario no encontrado'
                } 
                res.status(404).json(respuesta);
            }

        } catch (error) {

            res.json(error.message)

        }

    },

};

module.exports = controlador;

