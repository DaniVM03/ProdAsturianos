//Fichero donde se declaran las funciones para exportarlas al index.js
const fs=require('fs');

let cargarProductos=(fichero)=>{
    let existe=fs.existsSync(fichero);
    let productosJava=[]
    if(!existe)
        return productosJava
    else{
        productosJava = JSON.parse(fs.readFileSync(fichero,"utf-8"));
        return productosJava;
    }
};

let guardarProductos=(fichero, productosJava)=>{
    if(productosJava.length!==0 || productosJava!==null)
    {
        let productosJSON=JSON.stringify(productosJava);
        fs.writeFileSync(fichero,productosJSON);
    }
};

module.exports={
    guardarProductos:guardarProductos,
    cargarProductos:cargarProductos
};