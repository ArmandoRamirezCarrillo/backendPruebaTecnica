const express = require('express');
const router = express.Router();

const { registerValidations, loginValidations } = require('../validators/authValidators');
const {validarCampos} = require('../middlewares/validarCampos');
const { crearUsuario, loginUsuario, renovarToken } = require('../controllers/auth');
const { validarJWT } = require('../middlewares/validar-jwt');

/**
 * @swagger
 * /api/v1/auth/new:
 *   post:
 *     summary: Crear un nuevo usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - lastName
 *               - email
 *               - password
 *               - password2
 *             properties:
 *               name:
 *                 type: string
 *                 example: Juan Perez
 *               lastName:
 *                 type: string
 *                 example: Perez
 *               email:
 *                 type: string
 *                 example: juan@mail.com
 *               password:
 *                 type: string
 *                 example: Password123
 *               password2:
 *                 type: string
 *                 example: Password123
 *     responses:
 *       201:
 *         description: Usuario creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 uid:
 *                   type: string
 *                 name:
 *                   type: string
 *                 token:
 *                   type: string
 *       400:
 *         description: Ya existe un usuario con ese correo
 *       500:
 *         description: Error del servidor
 */
router.post('/new', [
    ...registerValidations,
    validarCampos
], crearUsuario);

/**
 * @swagger
 * /api/v1/auth:
 *   post:
 *     summary: Iniciar sesión de usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: juan@mail.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login exitoso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 uid:
 *                   type: string
 *                 name:
 *                   type: string
 *                 token:
 *                   type: string
 *       400:
 *         description: Credenciales incorrectas
 *       500:
 *         description: Error del servidor
 */
router.post('/', [
    ...loginValidations,
    validarCampos
], loginUsuario);

/**
 * @swagger
 * /api/v1/auth/renew:
 *   get:
 *     summary: Renovar token de autenticación
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: x-token
 *         schema:
 *           type: string
 *         required: true
 *         description: Token de autenticación JWT
 *     responses:
 *       200:
 *         description: Token renovado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 uid:
 *                   type: string
 *                 name:
 *                   type: string
 *                 token:
 *                   type: string
 *       401:
 *         description: Token inválido o expirado
 */
router.get('/renew', validarJWT,renovarToken);

module.exports = router;