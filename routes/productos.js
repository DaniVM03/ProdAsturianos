//Aquí se exportan los servicios
const express = require('express');
const session = require('express-session');
const utils=require(__dirname+'/../utils/auth.js');
const multer = require('multer');

//Librería multer
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
    cb(null, 'public/uploads')
    },
    filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname)
    }
})
let upload = multer({storage: storage});

let Producto = require(__dirname + '/../models/producto.js');
let router = express.Router();

// Servicios
router.get('/',utils.autenticacion, (req, res) => {
    Producto.find().then(resultado => {
        res.render('admin_productos', { ok: true, productos: resultado });
    }).catch (error => {
        res.render('admin_error',{ ok: false});
    }); 
});

router.get('/nuevo',utils.autenticacion, (req, res) => {
    res.render('admin_productos_form');
});

router.get('/editar/:id', utils.autenticacion, (req, res) => {
    Producto.findById(req.params.id).then(resultado => {
        if(resultado)
            res.render('admin_productos_form', { ok: true, producto: resultado });
        else
            res.render('admin_error', { ok: false,  error: "Producto no encontrado" });
    }).catch (error => {
        res.render('admin_error', { ok: false });
    });
});

router.post('/', utils.autenticacion, upload.single('imagen'),(req, res) => {

    let nuevoProducto = new Producto({
        nombre: req.body.nombre,
        precio: req.body.precio,
        descripcion: req.body.descripcion,
        imagen: req.file.filename
    });

    nuevoProducto.save().then(resultado => {
        res.redirect(req.baseUrl);
    }).catch(error => {
        res.render('admin_error',{ ok: false });
    });
});

router.post('/productos/:id', utils.autenticacion, upload.single('imagen'), utils.autenticacion,(req, res) => {
    let imagen=req.file===undefined?'':req.file.filename;

    Producto.findById(req.params.id).then(resultado => {
        if(imagen===''){
            imagen=resultado.imagen;
        }
        Producto.findByIdAndUpdate(req.params.id, {
            $set: {
                nombre: req.body.nombre,
                precio: req.body.precio,
                descripcion: req.body.descripcion,
                imagen: imagen
            }
        }, {new: true}).then(resultado => {
            if (resultado)
                res.redirect(req.baseUrl);
            else
                res.render('error',{ok: false, error: "Producto no encontrado"});
        }).catch(error => {
            res.render('error',{ok: false });
        });
    }).catch (error => {
        res.render('admin_error', { ok: false });
    });
});

router.delete('/:id', utils.autenticacion, (req, res) => {
    Producto.findByIdAndRemove(req.params.id).then(resultado => {
        if (resultado)
            res.redirect(req.baseUrl);
        else
            res.render('error',{ok: false, error: "Producto no encontrado"});
    }).catch(error => {
        res.render('error',{ok: false });
    });
});

//Servicio para añadir comentarios
router.get('/comentario/nuevo/:idProducto',utils.autenticacion, (req, res) => {
    Producto.findById(req.params.idProducto).then(resultado=>{ 
        res.render('admin_comentarios', { ok: true, producto: resultado });
    }).catch(error => {
        res.render('error',{ok: false });
    });
});

router.post('/comentarios/:idProducto', utils.autenticacion, (req,res)=>{
    let nickname=req.session.usuario;
    Producto.findById(req.params.idProducto).then(resultado=>{ 
        resultado.comentarios.push({nickname:nickname,comentario:req.body.comentario});   
        Producto.findByIdAndUpdate(req.params.idProducto, {
            $set: {
                comentarios: resultado.comentarios
            }
        }, {new: true}).then(resultado => {
            if (resultado)
                res.render('publico_producto', { ok: true, producto: resultado });
            else
            res.render('error',{ok: false, error:"Producto no encontrado" });
        }).catch(error => {
            res.render('error',{ok: false, error:"Error modificando los comentarios del producto" });
        });    
    }).catch(error => {
        res.render('error',{ok: false, error:"Error modificando los comentarios del producto" });
    });
});

router.delete('/comentarios/:idProducto/:idComentario', utils.autenticacion, (req, res) => {
   
    Producto.findById(req.params.idProducto).then(resultado=>{ 
        resultado.comentarios.forEach(element=>{
            if(element.id==req.params.idComentario){
                if(element.nickname==req.session.usuario)
                {
                    let comentarios= resultado.comentarios.filter(
                        comentario=> comentario.id!==req.params.idComentario
                    );
                    Producto.findByIdAndUpdate(req.params.idProducto, {
                        $set: {
                            comentarios: comentarios
                        }
                    }, {new: true}).then(resultado => {
                        if (resultado)
                            res.render('publico_producto', { ok: true, producto: resultado });
                        else
                            res.render('admin_error',{ok: false, error:"Producto no encontrado" });
                    }).catch(error => {
                        res.render('admin_error',{ok: false, error:"Error eliminando el comentario del producto" });
                    });
                }    
                else{
                    res.render('admin_error',{ok: false, error:"No tienes permisos para eliminar el comentario del producto" });
                }
            }
        });    
    }).catch(error => {
        res.render('error',{ok: false, error:"Error eliminando el comentario del producto" });
    });    
});

module.exports = router;