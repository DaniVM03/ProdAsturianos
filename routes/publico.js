const express = require('express');

let Producto = require(__dirname + '/../models/producto.js');
let router = express.Router();


// Servicios
router.get('',(req, res) => {
    Producto.find().then(resultado => {
        res.render('publico_index', { ok: true, productos: resultado });
    }).catch (error => {
        res.render('publico_error',{ ok: false});
    }); 
});

router.post('/buscar',(req, res) => {
    let texto= req.body.texto;
    Producto.find().then(resultado => {
        let productos=[];
        resultado.forEach(element=>{
            if((element.nombre).toLowerCase().includes(texto.toLowerCase())){
                productos.push(element);
            }
       });
       res.render('publico_index', { ok: true, productos: productos });
    }).catch (error => {
        res.render('publico_error',{ ok: false, error: "No se encontraron productos"});
    }); 
});

router.get('/producto/:id',(req, res) => {
    Producto.findById(req.params.id).then(resultado => {
        res.render('publico_producto', { ok: true, producto: resultado });
    }).catch (error => {
        res.render('public_error',{ ok: false, error: "Producto no encontrado"});
    }); 
});

module.exports = router;