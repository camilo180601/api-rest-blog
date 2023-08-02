const {connection} = require("./database/connection");
const express = require('express');
const cors = require('cors');

//connection to DB
connection();

//create server node
const app = express();
const port = 3800;

//configure cors
app.use(cors());

//convert body to object Js
app.use(express.json()); //receive data con content-type app/json
app.use(express.urlencoded({extended:true})) //receive data form urlencoded

//create routes
const routes_article = require("./routes/article");

app.get('/', (req, res) => {
    return res.status(200).send("<h1>Ejecutando API Rest Node</h1>");
});

app.use("/api", routes_article);


//create server and listen to requests http
app.listen(port, () => {
    console.log("¡¡Servidor en funcionamiento!!");
})