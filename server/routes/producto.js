const express = require("express");

const { verificaToken } = require("../middlewares/autenticacion");

let app = express();
let Producto = require("../models/producto");
const producto = require("../models/producto");
const { populate } = require("../models/producto");

// ===================================
// Obtener Productos
// ===================================

app.get("/productos", verificaToken, (req, res) => {
  // trae todos los productos
  // Ppulate: Usuario categoria
  // Paginado

  let desde = req.query.desde || 0;
  desde = Number(desde);

  Producto.find({ disponible: true })
    .skip(desde)
    .limit(5)
    .populate("usuario", "nombre email")
    .populate("categoria", "descripcion")
    .exec((err, productos) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }

      res.json({
        ok: true,
        productos,
      });
    });
});

// ===================================
// Obtener un Productos por ID
// ===================================
app.get("/productos/:id", verificaToken, (req, res) => {
  // Trae un solo Producto por ID
  // Ppulate: Usuario categoria
  // Paginado

  let id = req.params.id;

  Producto.findById(id)
    .populate("usuario", "nombre email")
    .populate("categoria", "descripcion")
    .exec((err, productoBD) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }

      if (!productoBD) {
        return res.status(400).json({
          ok: false,
          err: {
            message: "ID no existe",
          },
        });
      }

      res.json({
        ok: true,
        producto: productoBD,
      });
    });
});


// ===================================
// Buscar Productos
// ===================================

app.get('/productos/buscar/:termino',verificaToken,(req, res)=>{


    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');


    Producto.find({ nombre: regex })
        .populate('categoria','nombre')
        .exec((err, productoBD)=>{

            if (err) {
                return res.status(500).json({
                  ok: false,
                  err,
                });
              };

             res.json({
                 ok: true,
                 productos: productoBD
             });


        });

});






// ===================================
// Crear un Producto
// ===================================
app.post("/productos", verificaToken, (req, res) => {
  // grabar el usuario
  // Grabar una categoria del listado

  let body = req.body;

  let producto = new Producto({
    usuario: req.usuario._id,
    nombre: body.nombre,
    precioUni: body.precioUni,
    descripcion: body.descripcion,
    disponible: body.disponible,
    categoria: body.categoria,
  });

  producto.save((err, productoBD) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    res.status(201).json({
      ok: true,
      producto: productoBD,
    });
  });
});

// ===================================
// Actualizar un Producto
// ===================================
app.put("/productos/:id", verificaToken, (req, res) => {
  let id = req.params.id;
  let body = req.body;

  Producto.findById(id, (err, productoBD) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    if (!productoBD) {
      return res.status(400).json({
        ok: false,
        err: {
          message: "ID Producto no exite",
        },
      });
    }

    productoBD.nombre = body.nombre;
    productoBD.precioUni = body.precioUni;
    productoBD.categoria = body.categoria;
    productoBD.disponible = body.disponible;
    productoBD.descripcion = body.descripcion;

    productoBD.save((err, productoGuardado) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }

      res.json({
        ok: true,
        producto: productoBD,
      });
    });
  });
});

// ===================================
// Borrar un Producto
// ===================================
app.delete("/productos/:id", verificaToken, (req, res) => {
  // disponible: false

    let id = req.params.id;

    Producto.findById(id,(err,productoBD)=>{

        if (err) {
            return res.status(500).json({
              ok: false,
              err,
            });
          }

          if (!productoBD) {
            return res.status(400).json({
              ok: false,
              err: {
                  message: 'ID Producto no Existe'
              }
            });
          }

          productoBD.disponible = false;

          productoBD.save((err, productoBorrado)=>{

            if (err) {
                return res.status(500).json({
                  ok: false,
                  err,
                });
              }

              res.json({
                  ok: true,
                  producto: productoBorrado,
                  message: 'Producto Borrado'
              });

          });



    });




});

module.exports = app;
