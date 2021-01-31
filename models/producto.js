//Aquí se exporta el producto
const mongoose = require('mongoose');

// Definición del esquema de nuestra colección
let comentarioSchema= new mongoose.Schema({
    nickname:{
        type: String,
        require:true
    },
    comentario:{
        type: String,
        require:true,
        minlength: 5
    }
});

let productoSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        minlength: 3,
    },
    precio: {
        type: Number,
        required: true,
        min: 0
    },
    descripcion: {
        type: String,
        required: true,
    },
    imagen: {
        type: String
    },
    comentarios: [comentarioSchema]
});

// Asociación con el modelo (colección Productos)
let Producto = mongoose.model('productos', productoSchema);

module.exports = Producto;