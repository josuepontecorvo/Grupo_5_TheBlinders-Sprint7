const db = require('../../dataBase/models');
const { Op } = require("sequelize");
const { validationResult } = require('express-validator');
const path = require('path');
const fs = require('fs');
const { brotliDecompress } = require('zlib');

controller = {

    products: async (req,res) => {
        try {
            let data;
            let busqueda;
            // Page number < 1
            if (req.query.page <= 0) {

                let respuesta = {
                    meta : {
                        status : 400,
                        url : `/api/productos${req.url}`,
                    },
                    data : 'El número de página debe ser mayor o igual a 1'
                } 
                return res.status(400).json(respuesta);

            };
            // Search query retrieved but empty
            if (req.query.search == "") {

                let respuesta = {
                    meta : {
                        status : 400,
                        url : `/api/productos${req.url}`,
                    },
                    data : 'Debe ingresar una condición de busqueda'
                } 
                return res.status(400).json(respuesta);

            }


            if (req.query.page > 0 && req.query.search) {

                busqueda = req.query.search.toUpperCase();
                data =  await db.Product.findAndCountAll({
                    attributes: ['id','model','description'],
                    include: [{model: db.Category, attributes: ['name']}, {model: db.Brand, attributes: ['name']}, {model: db.Image, attributes: ['fileName']} ],
                    where: { description: {[Op.like] : '%'+busqueda+'%' }},
                    limit: 10,
                    offset: (req.query.page - 1) * 10,
                })

            } else if (req.query.page > 0) {

                data =  await db.Product.findAndCountAll({
                    attributes: ['id','model','description'],
                    include: [{model: db.Category, attributes: ['name']}, {model: db.Brand, attributes: ['name']}, {model: db.Image, attributes: ['fileName']} ],
                    limit: 10,
                    offset: (req.query.page - 1) * 10,
                })

            } else if (req.query.search) {

                busqueda = req.query.search.toUpperCase();
                data =  await db.Product.findAndCountAll({
                    attributes: ['id','model','description'],
                    include: [{model: db.Category, attributes: ['name']}, {model: db.Brand, attributes: ['name']}, {model: db.Image, attributes: ['fileName']} ],
                    where: { description: {[Op.like] : '%'+busqueda+'%' }},
                })

            } else {
                
                data =  await db.Product.findAndCountAll({
                    attributes: ['id','model','description'],
                    include: [{model: db.Category, attributes: ['name']}, {model: db.Brand, attributes: ['name']}, {model: db.Image, attributes: ['fileName']} ]
                })

            }
            

            let products = [...data.rows];
            let total = data.count;
            let totalByCategory = {
                accesorios : 0,
                bicicletas : 0
            }

            // The server can not find the requested resource.
            if ( total == 0 ) {

                let respuesta = {
                    meta : {
                        status : 404,
                        url : `/api/productos${req.url}`,
                    },
                    data : 'No se encontraron productos que cumplan con la condición'
                } 
                return res.status(404).json(respuesta);

            };

            // The page number require is greater than the pages available. 
            if (req.query.page && req.query.page > Math.ceil(total/10) ) {

                let respuesta = {
                    meta : {
                        status : 400,
                        url : `/api/productos${req.url}`,
                    },
                    data : 'El número de páginas disponibles es: ' + Math.ceil(total/10)
                } 
                return res.status(400).json(respuesta);

            };

            // The server find requested resource
            products = products.map(product => {
                if (product.Category.name == 'Bicicletas') {
                    ++totalByCategory.bicicletas 
                } else if (product.Category.name == 'Accesorios') {
                    ++totalByCategory.accesorios 
                }

                return {
                    id: product.id,
                    brand: product.Brand.name,
                    model: product.model,
                    description: product.description,
                    category: product.Category.name,
                    images: `/images/${product.Images[0].fileName}`,
                    detail: `/api/productos/${product.id}`
                };
            })  
            
            let respuesta = {
                meta : {
                    status : 200,
                    total : products.length,
                    totalByCategory ,
                    url : `/api/productos${req.url}`,
                    next: (req.query.page && req.query.page * 10 < total) ? `/api/productos/?page=${+req.query.page + 1}${req.query.search ? '&search='+req.query.search : '' }` : '',
                    previous: +req.query.page > 1 ? `/api/productos/?page=${+req.query.page - 1}${req.query.search ? '&search='+req.query.search : '' }` : ''
                },
                data : products
            } 

            return res.status(200).json(respuesta);

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
                product.Images =  `/images/${product.Images[0].fileName}`;
                
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

};

module.exports = controller;