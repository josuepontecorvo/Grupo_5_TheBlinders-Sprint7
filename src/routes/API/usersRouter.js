const express = require('express');
const router = express.Router();
const usersController = require('../../controllers/API/usersController');
const multerMiddleware = require('../../middleware/multer');
const userRegisterValidation = require('../../middleware/API/userRegisterValidation');
const userEditValidation = require('../../middleware/API/userEditValidation');
const uploadFile = multerMiddleware('images/users',"user");


router.get('/', usersController.list);
router.get('/:id', usersController.detail);
router.post('/crear', uploadFile.single('image'), userRegisterValidation, usersController.store);
router.put('/editar/:id',uploadFile.single('image'),  userEditValidation ,usersController.update);
router.delete('/eliminar/:id', usersController.delete);

module.exports = router;