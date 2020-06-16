// ultimo video 5 del folder 11

require('./config/config');

const colors = require('colors');

const express = require('express');
const app = express();


// getting-started.js
const mongoose = require('mongoose');
const path = require('path');

const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


// habilitar la carpeta public

//console.log(path.resolve(__dirname,'../public'));
app.use(express.static(path.resolve(__dirname,'../public')));


// Configuración Global de Rutas
app.use(require('./routes/index'));



// MONGO
mongoose.set('useCreateIndex', true);

try {
    mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }, () =>
        console.log("connected".blue));
} catch{
    console.log("could not connect".red);
    throw new err;
}



//mongoose.connect('mongodb://localhost:27017/cafe', (err, resp) => {
// try {
//     mongoose.connect(process.env.URLDB, {useNewUrlParser: true, useUnifiedTopology: true });
// } catch (error) {
//     throw new err;
// }

// mongoose.connect(process.env.URLDB ,(err, resp) => {

//     if (err) {
//         throw new err;
//     }

//     console.log("Bases de datos online !!!".green);

// });


app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto: '.yellow, process.env.PORT.red);
});