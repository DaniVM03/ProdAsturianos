//Aquí se exporta el producto
const mongoose = require('mongoose');

// Definición del esquema de nuestra colección
let usuarioSchema = new mongoose.Schema({
    nickname: {
        type: String,
        required: true,
        minlength: 5,
        unique: true
    },
    password: {
        type: String,
        minlength: 8,
        required: true
    }
});

// Asociación con el modelo (colección Productos)
let Usuario = mongoose.model('usuarios', usuarioSchema);

module.exports = Usuario;