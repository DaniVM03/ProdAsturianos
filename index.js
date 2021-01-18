/*Fichero donde se emplean las librerías, los servicios 
    y donde usa el método listen para escuchar las conexiones*/
const express=require('express');
const productos=__dirname+"/productos.json";
const utils=require(__dirname+'/fichero_utils.js');


let array=utils.cargarProductos(productos);
let app=express();
app.use(express.json());
app.listen(8080);

app.get('/productos',(req,res)=>{
    if (array.length !== 0) {
        res.status(200).send({ok:true,resultado: array});
    } 
    else {
        res.status(500).send({ok: false,
        error: "No se encontraron productos"});
    }
});

app.get('/productos/:id',(req,res)=>{
    let resultado= array.filter(
        producto=>producto.id==req.params['id']
    );
    if (resultado.length!==0) {
        res.status(200).send({ok: true, 
            resultado: resultado});
    } 
    else {
        res.status(400).send({ok: false,
            error: "Producto no encontrado"});
    }
});

app.post('/productos',(req,res)=>{
    let nuevoProducto = {
        id: req.body.id,
        nombre: req.body.nombre,
        descripcion: req.body.descripcion,
        precio: req.body.precio
    };
    let existe = array.filter(
        producto => producto.id == req.body.id
    );
    if (existe.length == 0) {
        array.push(nuevoProducto);
        res.status(200).send({ok: true,
            resultado: nuevoProducto});
    } 
    else {
        res.status(400).send({ok: false,
            error: "Código repetido"});
    }
    utils.guardarProductos(productos,array);
});

app.put('/productos/:id',(req,res)=>{
    let existe = array.filter(
        producto=>producto.id==req.params['id']
    );
    if (existe.length > 0) {
        let producto= existe[0];
        producto.nombre= req.body.nombre;
        producto.descripcion= req.body.descripcion;
        producto.precio= req.body.precio;
        res.status(200).send({ok: true,
            resultado:producto});
    } 
    else {
        res.status(400).send({ok: false,
            error: "Producto no encontrado"});
    }
    utils.guardarProductos(productos,array);
});

app.delete('/productos/:id',(req, res)=>{
    let filtrado = array.filter(
        producto => producto.id != req.params['id']
    );
    let productoBorrado=array.filter(
        producto => producto.id == req.params['id']
    );
    if (filtrado.length !== array.length) {
        array = filtrado;
        res.status(200).send({ok: true,
            resultado: productoBorrado});
    } 
    else {
        res.status(400).send({ok: false,
            error: "Producto no encontrado"});
    }
    utils.guardarProductos(productos,array);
});