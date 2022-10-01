const {body} = require ('express-validator');
const path = require ('path');

validations = [
    body('firstName')
        .notEmpty().withMessage('Campo obligatorio').bail()
        .isLength({min:2}).withMessage('Debes insertar un nombre con dos caracteres como mínimo'),
    body('lastName')
        .notEmpty().withMessage('Campo obligatorio').bail()
        .isLength({min:2}).withMessage('Debes insertar un apellido con dos caracteres como mínimo'),
    body('birthdate')
        .isDate().withMessage('Campo obligatorio'),
    body('email').notEmpty().withMessage('Campo obligatorio').bail()
        .isEmail().withMessage('Debes introducir in email válido'),
    body('password').notEmpty().withMessage('Campo obligatorio').bail()
        .isLength({min:8}).withMessage('La contraseña debe contener al menos 8 caracteres'),
    
];

module.exports = validations;