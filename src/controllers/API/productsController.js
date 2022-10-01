const db = require('../../dataBase/models');
const { Op } = require("sequelize");
const { validationResult } = require('express-validator');
const path = require('path');
const fs = require('fs');

controller = {

    products: async (req,res) => {
        try {
            const data = await db.Product.findAll({
                include: [{model: db.Image, attributes: ['fileName'] }, db.Category, db.Brand]
            });
            let products = [...data];
            let totalCategory =  await db.Product.findAndCountAll({
                attributes: ['Category.name'],
                include: [db.Category],
                group : "Category.name"
            })
            let totalByCategory = {
                accesorios : totalCategory["count"][0]["count"],
                bicicletas : totalCategory["count"][1]["count"],
            }
            products = products.map(product => {
                return {
                    id: product.id,
                    brand: product.Brand.name,
                    model: product.model,
                    description: product.description,
                    category: product.Category.name,
                    images: product.Images,
                    detail: `/api/productos/${product.id}`
                };
            })  
            let respuesta = {
                meta : {
                    status : 200,
                    total : products.length,
                    totalByCategory ,
                    url : '/api/productos'
                },
                data : products
            } 

            res.status(200).json(respuesta);

        } catch (error) {
            res.json(error.message);
        }
    },

    detail: async (req,res) => {
        try {
            const id = +req.params.id;
            const data = await db.Product.findByPk(id, {
                include: [{model: db.Brake, attributes: ['type'] }, {model: db.Brand, attributes: ['name'] }, {model: db.Image, attributes: ['fileName'] }, {model: db.WheelSize, attributes: ['number'] }, {model: db.Frame, attributes: ['name'] }, {model: db.Shift, attributes: ['number'] }, {model: db.Suspension, attributes: ['type'] }],
                attributes: ['description', 'model', 'price', 'discount'],
            });    
            const product = await data?.toJSON();

            if (product) {
                let respuesta = {
                    meta : {
                        status : 200,
                        url : `/api/productos/${id}`,
                    },
                    data : product
                } 
                res.status(200).json(respuesta);
            } else {
                let respuesta = {
                    meta : {
                        status : 404,
                        url : `/api/productos/${req.params.id}`,
                    },
                    data : 'Producto no encontrado'
                } 
                res.status(404).json(respuesta);
            }
        } catch (error) {
            res.json({error: error.message});
        }
        
    },

    store: async (req, res) => {
        try {
            let product = req.body;

            if (req.body.id) {
                let respuesta = {
                    meta : {
                        status : 400,
                        url : `/api/productos/crear`,
                    },
                    data : 'No puede enviar el id en el body'
                } 
                return res.status(400).json(respuesta);
            }

            // Validaciones de productos

                const errors = validationResult(req);
            if (errors.isEmpty()) {
                let imagenes= []
                const newProduct = await db.Product.create(product);
                if (req.files) {
                    for(let i = 0 ; i<req.files.length;i++) {
                        imagenes.push({
                            fileName: req.files[i].filename,
                            productId: newProduct.id
                        })
                    }
                }


                if (imagenes.length > 0) {

                    await db.Image.bulkCreate(imagenes)

                } else {

                    await db.Image.create({
                        fileName: 'default-product-image.png',
                        productId: newProduct.id
                    })
                }



                let respuesta = {
                    meta : {
                        status : 201,
                        url : `/api/productos/${newProduct.id}`,
                    },
                    data : newProduct
                } 
                res.status(201).json(respuesta);
                
                
            } else {
                // if (req.files) {
                //     let {files} = req;
                // for (let i = 0 ; i< files.length; i++) {
                //     fs.unlinkSync(path.resolve(__dirname, '../../public/images/'+files[i].filename))
                // }
                // };
                let respuesta = {
                    meta : {
                        status : 400,
                        url : `/api/productos/crear`,
                    },
                    data : errors.mapped()
                } 
                res.status(400).json(respuesta);
            }
        } catch (error) {
            res.json({error: error.message});
        }
        
    },

    update: async (req,res) => {
        try {
            // Validaciones de productos

            let idToUpdate = req.params.id;
            const productToUpdate = await db.Product.findByPk(idToUpdate);  

            if (!productToUpdate) {
                let respuesta = {
                    meta : {
                        status : 404,
                        url : `/api/productos/editar/${req.params.id}`,
                    },
                    data : 'Producto no encontrado'
                } 
                return res.status(404).json(respuesta);
    
    
            } else if (req.body.id) {
                let respuesta = {
                    meta : {
                        status : 400,
                        url : `/api/producto/editar/${req.params.id}`,
                    },
                    data : 'No puede enviar el id en el body'
                } 
                return res.status(400).json(respuesta);
            }


            const errors = validationResult(req);
            // There are not validations errors
            if (errors.isEmpty()) {

                let dataUpdate = req.body;
                let imagenes= []
                await db.Product.update({
                    ...dataUpdate,
                }, {
                    where: {
                        id: idToUpdate
                    }
                });

                if (req.files) {

                    for(let i = 0 ; i<req.files.length;i++) {
                        imagenes.push({
                            fileName: req.files[i].filename,
                            productId: idToUpdate
                        })
                    }

                }

                if (imagenes.length > 0) {
                    const oldImages = await db.Image.findAll({where: {productId: idToUpdate}})
                    oldImages.forEach( image => {
                        fs.unlinkSync(path.resolve(__dirname, '../../public/images/'+image.fileName))
                    })
                    await db.Image.destroy({where: {productId: idToUpdate}})
                    await db.Image.bulkCreate(imagenes)
                }

                const product = await db.Product.findByPk(idToUpdate);  

                let respuesta = {
                    meta : {
                        status : 200,
                        url : `/api/productos/editar/${idToUpdate}`,
                    },
                    data : product
                } 
                res.status(200).json(respuesta);

            } else {
                if (req.files) {
                    let {files} = req;
                    for (let i = 0 ; i< files.length; i++) {
                        fs.unlinkSync(path.resolve(__dirname, '../../public/images/'+files[i].filename))
                    }
                };
                let respuesta = {
                    meta : {
                        status : 400,
                        url : `/api/productos/editar/${idToUpdate}`,
                    },
                    data : errors.mapped()
                } 
                res.status(400).json(respuesta);
            }

        } catch (error) {
            res.json({error: error.message});
        }
    },

    delete: async (req,res) => {
        try {

            const { id } = req.params;
            let data = await db.Product.findByPk(id);
            const product = await data?.toJSON();

            if (product) {

                let imagenes = await db.Image.findAll({
                    where: {productId: id}
                });
                // if (imagenes) {
                //     let files = imagenes.filter(image => image.fileName != 'default-product-image.png');
                // for (let i = 0 ; i< files.length; i++) {
                //     fs.unlinkSync(path.resolve(__dirname, '../../public/images/'+files[i].fileName))
                // }
                // };
                await db.Image.destroy({
                    where: {
                        productId: id
                    }
                }, {
                    force: true
                });
    
                await db.Product.destroy({
                    where: {
                        id
                    }
                }, {
                    force: true
                });

                let respuesta = {
                    meta : {
                        status : 200,
                        url : `/api/productos/eliminar/${id}`,
                    },
                    data : product
                } 
                res.status(200).json(respuesta);

            } else {
                let respuesta = {
                    meta : {
                        status : 404,
                        url : `/api/productos/eliminar/${req.params.id}`,
                    },
                    data : 'Producto no encontrado'
                } 
                res.status(404).json(respuesta);
            }



        } catch (error) {

            res.json(error.message)

        }
    },
    
    search: async (req,res) => {
        try {
            let busqueda = req.query?.search;

            if (!busqueda) {
                let respuesta = {
                    meta : {
                        status : 404,
                        url : `/api/productos/buscar`,
                    },
                    data : 'Debes ingresar una condición de busqueda.'
                } 
                return res.status(404).json(respuesta);
            }

            const data = await db.Product.findAll({
                include: [{model: db.Image, attributes: ['fileName'] }, db.Category, db.Brand],
                where: { description: {[Op.like] : '%'+busqueda+'%' }}
            });
            let products = [...data];

            // If there is no coincidence 

            if (!products) {
                let respuesta = {
                    meta : {
                        status : 404,
                        url : `/api/productos/buscar`,
                    },
                    data : 'Producto no encontrado'
                } 
                return res.status(404).json(respuesta);
            }

            let totalCategory =  await db.Product.findAndCountAll({
                attributes: ['Category.name'],
                where: { description: {[Op.like] : '%'+busqueda+'%' }},
                include: [db.Category],
                group : "Category.name"
            })


            let totalByCategory = {
                accesorios : totalCategory["rows"][0]["Category"]["name"] == "Accesorios" ? totalCategory["count"]?.[0]?.["count"] : undefined,
                bicicletas : totalCategory["rows"][0]["Category"]["name"] == "Bicicletas" ? totalCategory["count"]?.[0]?.["count"] : totalCategory["count"]?.[1]?.["count"]
            }
            products = products.map(product => {
                return {
                    id: product.id,
                    brand: product.Brand.name,
                    model: product.model,
                    description: product.description,
                    category: product.Category.name,
                    images: product.Images,
                    detail: `/api/productos/${product.id}`
                };
            })  
            let respuesta = {
                meta : {
                    status : 200,
                    total : products.length,
                    totalByCategory ,
                    url : '/api/productos/buscar'
                },
                data : products
            } 

            res.status(200).json(respuesta);

        } catch (error) {
            res.json(error.message);
        }
    },

};

module.exports = controller;