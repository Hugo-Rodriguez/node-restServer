// ultimo video 17 del folder 9

require('./config/config');

const colors = require('colors');

const express = require('express');
const app = express();


// getting-started.js
const mongoose = require('mongoose');

const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(require('./routes/usuario'));

mongoose.set('useCreateIndex', true);

try {
    mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }, () =>
        console.log("connected"));
} catch{
    console.log("could not connect");
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