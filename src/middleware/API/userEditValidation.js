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
    body('password').custom((value, {req})=>{
        if (req.body.password && value.length < 8){
            throw new Error ('La contraseña debe contener 8 caracteres como mínimo')
        }
        return true;
    })
];

module.exports = validations;