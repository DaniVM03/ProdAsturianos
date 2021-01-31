//Middleware de autenticación
let autenticacion = (req, res, next) => {
    if (req.session && req.session.usuario)
        return next();
    else
        res.render('../views/auth_login');
};
let rol = (rol) => {
    return (req, res, next) => {
    if (rol === req.session.rol)
        next();
    else
        res.render('../views/auth_login');
    }
}   

module.exports={
    rol:rol,
    autenticacion:autenticacion
};