const {response} = require('express');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/Usuario');
const {generarJWT} = require('../helpers/jwt');

const crearUsuario = async(req, res = response) => {
    const {email, password} = req.body;
    try {
        // Validar que el usuario NO exista
        const usuarioExistente = await buscarUsuarioPorEmail(email);
        if (usuarioExistente) {
            return res.status(400).json({
                success: false,
                msg: 'Ya existe un usuario con ese correo',
            });
        }

        const usuario = new Usuario(req.body);
        // Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);
        await usuario.save();

        // Generar JWT
        const token = await generarJWT(usuario.id, usuario.name);

        res.status(201).json({
            success: true,
            uid: usuario.id,
            name: usuario.name,
            token
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success:false,
            msg: 'Error al crear usuario, por favor hable con el administrador'
        });
    }
};


const loginUsuario = async(req, res = response) => {
    const {email, password} = req.body;
    try {
        // Validar que el usuario SÍ exista
        const usuario = await buscarUsuarioPorEmail(email);
        if (!usuario) {
            return res.status(400).json({
                success: false,
                msg: 'El usuario no existe con ese correo, por favor registrese',
            });
        }

        // Confirmar password
        const validPassword = bcrypt.compareSync(password, usuario.password);
        if(!validPassword){
            return res.status(400).json({
                success: false,
                msg: 'Password incorrecto',
            });
        }

        // Generar JWT
        const token = await generarJWT(usuario.id, usuario.name);

        res.status(200).json({
            success:true,
            uid: usuario.id,
            name: usuario.name,
            token,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success:false,
            msg: 'Por favor hable con el administrador'
        });   
    }
}

const renovarToken = async(req, res = response) => {

    const {uid, name} = req;

    const token = await generarJWT(uid, name);

    res.json({
        success: true,
        uid, name,
        msg: 'Token renovado correctamente',
        token
    })
}

// Función de utilidad para buscar usuario por email
const buscarUsuarioPorEmail = async (email) => {
    return await Usuario.findOne({email});
}

module.exports = {crearUsuario, loginUsuario, renovarToken};