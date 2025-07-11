const {response} = require('express');
const PeopleService = require('../services/peopleService');

const getUsers = async (req, res = response) => {
    try {
        const people = await PeopleService.getAllActive();
        res.status(200).json({
            success: true,
            msg: 'Lista de usuarios',
            data: people
        });
    } catch (error) {
        res.status(500).json({ success: false, msg: 'Error al obtener usuarios' });
    }
}

const getUserById = async (req, res = response) => {
    const { id } = req.params;
    try {
        const user = await PeopleService.getById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                msg: `Usuario con ID: ${id} no encontrado`
            });
        }
        res.status(200).json({
            success: true,
            msg: `Detalle del usuario con ID: ${id}`,
            data: user
        });
    } catch (error) {
        return res.status(500).json({ success: false, msg: 'Error al obtener usuario' });
    }
}

const updateUsuario = async (req, res = response) => {
    const { id } = req.params;
    try {
        const user = await PeopleService.getById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                msg: `Usuario con ID: ${id} no encontrado`
            });
        }
        const usuarioActualizado = await PeopleService.updateById(id, req.body);
        res.status(200).json({
            success: true,
            msg: `Usuario con ID: ${id} actualizado correctamente`,
            user: usuarioActualizado
        });
    } catch (error) {
        return res.status(500).json({ success: false, msg: 'Error al actualizar usuario' });
    }
}

const deleteUsuario = async (req, res = response) => {
    const { id } = req.params;
    try {
        const user = await PeopleService.deactivateById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                msg: `Usuario con ID: ${id} no encontrado`
            });
        }
        res.status(200).json({
            success: true,
            msg: `Usuario con ID: ${id} desactivado correctamente`,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            msg: 'Error al desactivar el usuario, hable con el administrador'
        });
    }
}

const crearUsuario = async (req, res = response) => {
    try {
        const people = await PeopleService.create(req.body);
        if (!people) {
            return res.status(400).json({
                success: false,
                msg: 'Un usuario ya existe con ese correo'
            });
        }
        res.status(201).json({
            success: true,
            msg: 'Usuario creado correctamente con los datos proporcionados',
        });
    } catch (error) {
        console.error('Error al crear el usuario:', error);
        return res.status(500).json({
            success: false,
            msg: 'Error al crear el usuario, por favor intente más tarde'
        });
    }
}

module.exports = {getUsers, getUserById, updateUsuario, deleteUsuario, crearUsuario};