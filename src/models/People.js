const {Schema, model} = require('mongoose');

//Esquema de People
const PeopleSchema = new Schema({
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
    age: {
        type: Number,
        required: true,
        index: true
    },
    phone: {
        type: String,
        required: false,
        index: true
    },
    address: {
        type: String,
        required: false,
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    status: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = model('People', PeopleSchema);