const mongoose = require('mongoose');
const Usuario = require(__dirname + '/../models/usuario');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const myPlaintextPassword = '123456789';

mongoose.connect(
    'mongodb://localhost:27017/prodAsturianosV3', 
    {useNewUrlParser:true, useUnifiedTopology:true}
);

Usuario.collection.drop();

bcrypt.hash(myPlaintextPassword, saltRounds, function(err, hash) {
    let usu1 = new Usuario({
        nickname: 'daniel',
        password: hash
       });
       usu1.save();
       
       let usu2 = new Usuario({
        nickname: 'nacho',
        password: hash
       });
       usu2.save();
});