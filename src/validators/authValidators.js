const { check } = require('express-validator');

const passwordValidator = check('password', 'La contraseña debe tener al menos 8 caracteres, una mayúscula, letras, números y un caracter especial')
  .isLength({ min: 8 })
  .matches(/^(?=.*[A-Z])(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).+$/);

const registerValidations = [
  check('name', 'El nombre es obligatorio').not().isEmpty(),
  check('lastName', 'El apellido es obligatorio').not().isEmpty(),
  check('email', 'El correo es obligatorio').isEmail(),
  passwordValidator,
  check('password2', 'Las contraseñas deben coincidir').custom((value, { req }) => {
    if (value !== req.body.password) throw new Error('Las contraseñas no coinciden');
    return true;
  }),
];

const loginValidations = [
  check('email', 'El correo es obligatorio').isEmail(),
  passwordValidator,
];

module.exports = { registerValidations, loginValidations };
