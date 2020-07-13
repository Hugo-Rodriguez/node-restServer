const express = require("express");
const fileUpload = require("express-fileupload");

const fs = require("fs");
const path = require("path");

const app = express();

//importo schema
const Usuario = require("../models/usuario");
const Producto = require("../models/producto");

// default options
app.use(fileUpload());

//app.put("/upload", function (req, res) {
app.put("/upload/:tipo/:id", function (req, res) {
  let tipo = req.params.tipo;
  let id = req.params.id;

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({
      ok: false,
      err: {
        message: "Ningun archivo fue seleccionado.",
      },
    });
  }

  // validar tipo
  let tiposValidos = ["productos", "usuarios"];
  if (tiposValidos.indexOf(tipo) < 0) {
    return res.status(400).json({
      ok: false,
      err: {
        message: "Los tipos permitidos son: " + tiposValidos.join(", "),
      },
    });
  }

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  let archivo = req.files.archivo;

  // extensiones permitidas
  let extencionesValidas = ["png", "jpg", "gif", "jpeg"];

  let nombreCortado = archivo.name.split(".");
  let extension = nombreCortado[nombreCortado.length - 1];

  //   console.log(nombreCortado);
  //   console.log(extension);

  if (extencionesValidas.indexOf(extension) < 0) {
    return res.status(400).json({
      ok: false,
      err: {
        message:
          "Las extensiones permitidas son: " + extencionesValidas.join(", "),
        Ext: "Archivo tipo: " + extension,
      },
    });
  }

  // Cambiar nombre al archivo

  let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;

  // Use the mv() method to place the file somewhere on your server
  //archivo.mv(`uploads//${tipo}/${archivo.name}`, function (err) {
  archivo.mv(`uploads//${tipo}/${nombreArchivo}`, function (err) {
    if (err)
      return res.status(500).json({
        ok: false,
        err,
      });

    // aqui la imagen está cargada
    if (tipo === "usuarios") {
      imagenUsuario(id, res, nombreArchivo);
    } else {
      imagenProducto(id, res, nombreArchivo);
    }

    // res.json({
    //   ok: true,
    //   message: "imagen subida correctamente",
    // });
  });
});

function imagenUsuario(id, res, nombreArchivo) {
  Usuario.findById(id, (err, usuarioBD) => {
    if (err) {
      borraArchivo(nombreArchivo, "usuarios");

      return res.status(500).json({
        ok: false,
        err,
      });
    }

    if (!usuarioBD) {
      borraArchivo(nombreArchivo, "usuarios");
      return res.status(400).json({
        ok: false,
        err: {
          message: "Usuario no existe",
        },
      });
    }

    // let pathImagen = path.resolve(__dirname, `../../uploads/usuarios/${ usuarioBD.img }`);

    // if( fs.existsSync( pathImagen)){

    //   // borra imagen del usuario
    //   fs.unlinkSync(pathImagen);

    // }

    borraArchivo(usuarioBD.img, "usuarios");

    usuarioBD.img = nombreArchivo;

    usuarioBD.save((err, usuarioGuardado) => {
      res.json({
        ok: true,
        usuario: usuarioGuardado,
        img: nombreArchivo,
      });
    });
  });
}

function imagenProducto(id, res, nombreArchivo) {
  Producto.findById(id, (err, productoBD) => {
    if (err) {
      borraArchivo(nombreArchivo, "productos");

      return res.status(500).json({
        ok: false,
        err,
      });
    }

    if (!productoBD) {
      borraArchivo(nombreArchivo, "productos");
      return res.status(400).json({
        ok: false,
        err: {
          message: "Producto no existe",
        },
      });
    }

    // let pathImagen = path.resolve(__dirname, `../../uploads/usuarios/${ usuarioBD.img }`);

    // if( fs.existsSync( pathImagen)){

    //   // borra imagen del usuario
    //   fs.unlinkSync(pathImagen);

    // }

    borraArchivo(productoBD.img, "productos");

    productoBD.img = nombreArchivo;

    productoBD.save((err, productoGuardado) => {
      res.json({
        ok: true,
        producto: productoGuardado,
        img: nombreArchivo,
      });
    });
  });
}

// Borrar archivo
function borraArchivo(nombreImagen, tipo) {
  let pathImagen = path.resolve(
    __dirname,
    `../../uploads/${tipo}/${nombreImagen}`
  );

  if (fs.existsSync(pathImagen)) {
    // borra imagen del usuario
    fs.unlinkSync(pathImagen);
  }
}
module.exports = app;
