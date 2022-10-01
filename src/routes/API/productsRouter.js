const express = require('express');
const router = express.Router();
const productsController = require('../../controllers/API/productsController');
const multerMiddleware = require('../../middleware/multer')
const uploadFile = multerMiddleware('images','product');
const productCreateValidation = require('../../middleware/productCreateValidation');
const productEditValidation = require('../../middleware/productEditValidation');


router.get('/', productsController.products);
router.get('/:id', productsController.detail);
router.get('/buscar', productsController.search);
router.post('/crear',uploadFile.array('image'), productCreateValidation,  productsController.store);
router.put('/:id',uploadFile.array('image'),productEditValidation , productsController.update);
router.delete('/:id', productsController.delete);

module.exports = router;