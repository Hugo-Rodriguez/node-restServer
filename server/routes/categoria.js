const express = require("express");

let { verificaToken } = require("../middlewares/autenticacion");

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

app.get("/categoria", (req, res) => {});

// =============================
// Mostrar una categorias por ID
// =============================

app.get("/categoria/:id", (req, res) => {
  // CAtegoria.findById(.........)
});

// =============================
// Crear nueva categorias
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
        err,
      });
    }

    res.json({
      ok: true,
      categoria: categoriaBD,
    });
  });
});

// =============================
// Mostrar todas las categorias
// =============================

app.put("/categoria/:id", (req, res) => {
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
// Borrar una categorias
// =============================

app.put("/categoria:/id", (req, res) => {
  // rsolo un administrador puede borrar categoria
  // Categoria.findByAndRemove
});

module.exports = app;
