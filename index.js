//Librerías
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const nunjucks = require('nunjucks');
const methodOverride = require('method-override');
const session = require('express-session');

//Enrutadores
const productos = require(__dirname + '/routes/productos');
const auth = require(__dirname + '/routes/auth');
const publico = require(__dirname + '/routes/publico');

// Conexión con la BD
mongoose.connect(
    'mongodb://localhost:27017/prodAsturianosV3', 
    {useNewUrlParser:true, useUnifiedTopology:true}
);

// Servidor Express
let app = express();

// Configuracion de las sesiones
app.use(session({
    secret: '1234',
    resave: true,
    saveUninitialized: false,
    expires: new Date(Date.now() + (30 * 60 * 1000))
}));
app.use((req, res, next) => {
    res.locals.session = req.session;
    next();
});

// Motor de plantillas nunjucks
nunjucks.configure('views', {
    autoescape: true,
    express: app
});
app.set('view engine', 'njk');

// Middleware body-parser para peticiones POST y PUT
// Enrutadores para cada grupo de rutas
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object'
          && '_method' in req.body) {
        let method = req.body._method;
        delete req.body._method;
        return method;
    }
}));

app.use('/public', express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/node_modules/bootstrap/dist'));
app.use('/', publico);
app.use('/admin', productos);
app.use('/auth', auth);

// Puesta en marcha del servidor
app.listen(8080);