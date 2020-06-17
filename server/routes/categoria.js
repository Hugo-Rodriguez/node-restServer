const express = require("express");

let {
  verificaToken,
  verificaAdmin_Role,
} = require("../middlewares/autenticacion");

let app = express();

let Categoria = require("../models/categoria");

// agregado por mi en Usuario y Categoria
const mongoose = require("mongoose");
mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);

// ============================
// Mostrar todas las categorias
// ============================

app.get("/categoria", verificaToken, (req, res) => {
  Categoria.find({})
  .sort('descripcion')
  .populate('usuario','nombre email')
  .exec((err, categorias) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    res.json({
      ok: true,
      categorias,
    });
  });
});

// =============================
// Mostrar una categorias por ID
// =============================

app.get("/categoria/:id", verificaToken, (req, res) => {
  // Categoria.findById(...)

  let id = req.params.id;

  Categoria.findById(id,(err,categoriaBD)=>{

    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }
    
    if (!categoriaBD) {
      return res.status(500).json({
        ok: false,
        err: {
          message: 'Categoria ID ! no encontrada'
        }
      });
    }

    res.json({
      ok: true,
      categoria: categoriaBD
    });

  })

});

// =============================
// Crear nueva Categoria
// =============================

app.post("/categoria", verificaToken, (req, res) => {
  // regresa la nueva categoria
  // req.usuario._id
  let body = req.body;

  let categoria = new Categoria({
    descripcion: body.descripcion,
    usuario: req.usuario._id,
  });

  categoria.save((err, categoriaBD) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    if (!categoriaBD) {
      return res.status(400).json({
        ok: false,
        err: err,
      });
    }

    res.json({
      ok: true,
      categoria: categoriaBD,
    });
  });
});

// =============================
// Actualizar Categoria
// =============================

app.put("/categoria/:id", verificaToken, (req, res) => {
  // regresa la nueva categoria
  // req.usuario._id
  let id = req.params.id;
  let body = req.body;

  let descCategoria = {
    descripcion: body.descripcion,
  };

  Categoria.findByIdAndUpdate(
    id,
    descCategoria,
    { new: true, runValidators: true },
    (err, categoriaBD) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }

      if (!categoriaBD) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }

      res.json({
        ok: true,
        categoria: categoriaBD,
      });
    }
  );
});

// =============================
// Borrar una Categoria
// =============================

app.delete(
  "/categoria/:id",
  [verificaToken, verificaAdmin_Role],
  (req, res) => {
    // solo un administrador puede borrar categoria
    // Categoria.findByIdAndRemove

    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaBD) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }

      if (!categoriaBD) {
        return res.status(400).json({
          ok: false,
          err: {
            message: "El Id no existe",
          },
        });
      }

      res.json({
        ok: true,
        message: "Categoria Borrada",
      });
    });
  }
);

module.exports = app;
