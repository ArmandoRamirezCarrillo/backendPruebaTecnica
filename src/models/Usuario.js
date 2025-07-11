const {Schema, model} = require('mongoose');

//Esquema de Usuario
const UsuarioSchema = new Schema({
    name: {
        type: String,
        required: true, 
        index: true
    },
    lastName: {
        type: String,
        required: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    password: {
        type: String,
        required: true,
    }
}, {
    timestamps: true
});

module.exports = model('Usuario', UsuarioSchema);