
const express = require('express');

const bcrypt = require('bcrypt');
const _ = require('underscore');

const Usuario = require('../models/usuario');
const {  verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion')

const app = express();


app.get('/usuario', verificaToken ,(req, res) => {

    // return res.json({
    //     usuario: req.usuario,
    //     nombre: req.usuario.nombre,
    //     email: req.usuario.email,
    // });

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 10;
    limite = Number(limite);

    Usuario.find({ estado: true }, 'nombre email role estado google img')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err: err
                });
            }

            Usuario.countDocuments({ estado: true }, (err, conteo) => {

                res.json({
                    ok: true,
                    usuarios: usuarios,
                    cuantos: conteo
                });

            });
        });

    //res.json('get Usuario Local!!!');
});

app.post('/usuario', [verificaToken, verificaAdmin_Role], (req, res)=> {

    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        // password: body.password,
        img: body.img,
        role: body.role
        
    });

    usuario.save((err, usuarioBD) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            });
        }

        // usuarioBD.password = null;

        res.json({
            ok: true,
            usuario: usuarioBD

        });
    });

    // if (body.nombre === undefined) {

    //     res.status(400).json({
    //         ok: false,
    //         mensaje: 'El nombre es necesario'
    //     });

    // } else {
    //     res.json({
    //         persona: body
    //     });
    // }

});

app.put('/usuario/:id', [verificaToken, verificaAdmin_Role],function (req, res) {

    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioBD) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            });
        };

        res.json({
            ok: true,
            usuario: usuarioBD
            //id
        });

    });


});

app.delete('/usuario/:id',[verificaToken, verificaAdmin_Role], function (req, res) {


    let id  = req.params.id;

    // Usuario.findByIdAndRemove(id, (err, usuarioBorrado)=> { // remueve definitivamente

    let cambiaEstado = {
        estado: false
    }

    Usuario.findByIdAndUpdate(id, cambiaEstado,{new: true}, (err, usuarioBorrado)=> { //  actualiza estado

        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            });
        };

        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "Usuario no Encontrado"
                }
            });
        };

        res.json({
            ok: true,
            usuario: usuarioBorrado
        });

    });


    //res.json('delete Usuario');
});


module.exports = app;