const express = require('express');
const router = express.Router();
const productsController = require('../../controllers/API/productsController');
const multerMiddleware = require('../../middleware/multer')
const uploadFile = multerMiddleware('images','product');
const productCreateValidation = require('../../middleware/API/productCreateValidation');
const productEditValidation = require('../../middleware/API/productEditValidation');


router.get('/', productsController.products);
router.get('/info-formulario', productsController.formInfo);
router.get('/ultimo', productsController.lastProduct);
router.get('/editar/:id', productsController.edit);
router.get('/:id', productsController.detail);
router.post('/crear',uploadFile.array('image'), productCreateValidation,  productsController.store);
router.put('/editar/:id',uploadFile.array('image'),productEditValidation , productsController.update);
router.delete('/eliminar/:id', productsController.delete);

module.exports = router;