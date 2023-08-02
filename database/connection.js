const mongoose = require("mongoose");

const connection = async() => {

    try{
        mongoose.set('strictQuery', false);
        await mongoose.connect("mongodb://127.0.0.1:27017/my_blog");
        console.log("Conectado correctamente a la DB");
    
    } catch(err) {
        console.log(err)
        throw new Error("Error al conectar a la Base de datos");
    }
}

module.exports = {
    connection
}