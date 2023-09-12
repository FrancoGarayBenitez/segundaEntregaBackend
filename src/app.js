const express = require('express');
const mongoose = require('mongoose');
const productRouter = require('./routes/products.router');
const cartRouter = require('./routes/carts.router');
const app = express();
const PORT = 8080;

//Middleware para analizar el cuerpo de las solicitudes.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Escuchando servidor
app.listen(PORT, () => {
    console.log(`Servidor is running on port ${PORT}`);
})

//Conexión con Mongoose
const enviroment = async () => {
await mongoose.connect("mongodb+srv://francogaray4:fg_dbUser_84@cluster0.9vspn3d.mongodb.net/ecommerceProyectoFinal?retryWrites=true&w=majority")
    .then(() => {
        console.log("Conectado a la base de datos de MongoDB Atlas.");
    })
    .catch((error) => {
        console.log("Error al conectar", error);
    })
}
enviroment();


//Routing
app.use("/", productRouter);
app.use("/", cartRouter);


