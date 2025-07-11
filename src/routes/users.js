
const express = require('express');
const router = express.Router();

const { validarCampos } = require('../middlewares/validarCampos');
const { getUsers, getUserById, updateUsuario, deleteUsuario, crearUsuario } = require('../controllers/user');
const { check } = require('express-validator');

/**
 * @swagger
 * /api/v1/users:
 *   get:
 *     summary: Obtener todos los usuarios
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 msg:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       500:
 *         description: Error al obtener usuarios
 */
router.get('/', getUsers);

/**
 * @swagger
 * /api/v1/users/user/{id}:
 *   get:
 *     summary: Obtener un usuario por ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Detalle del usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 msg:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error al obtener usuario
 */
router.get('/user/:id', getUserById);

/**
 * @swagger
 * /api/v1/users/user/{id}:
 *   put:
 *     summary: Actualizar un usuario
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Usuario actualizado correctamente
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error al actualizar usuario
 */
router.put('/user/:id', updateUsuario);

/**
 * @swagger
 * /api/v1/users/user/{id}:
 *   delete:
 *     summary: Eliminar un usuario
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario eliminado correctamente
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error al eliminar usuario
 */
router.delete('/user/:id', deleteUsuario);

/**
 * @swagger
 * /api/v1/users/new:
 *   post:
 *     summary: Crear un nuevo usuario
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - lastName
 *               - age
 *               - email
 *             properties:
 *               name:
 *                 type: string
 *                 example: Juan
 *               lastName:
 *                 type: string
 *                 example: Perez
 *               age:
 *                 type: integer
 *                 example: 30
 *               email:
 *                 type: string
 *                 example: juan@mail.com
 *     responses:
 *       201:
 *         description: Usuario creado correctamente
 *       400:
 *         description: Datos inválidos
 *       500:
 *         description: Error al crear usuario
 */
router.post('/new', [
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('lastName', 'El apellido es obligatorio').not().isEmpty(),
    check('age', 'La edad es obligatoria').not().isEmpty().isNumeric(),
    check('email', 'El correo es obligatorio').isEmail(),
], validarCampos, crearUsuario);

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 60c72b2f9b1e8e001c8e4b8a
 *         name:
 *           type: string
 *           example: Juan
 *         lastName:
 *           type: string
 *           example: Perez
 *         age:
 *           type: integer
 *           example: 30
 *         email:
 *           type: string
 *           example: juan@mail.com
 */

module.exports = router;