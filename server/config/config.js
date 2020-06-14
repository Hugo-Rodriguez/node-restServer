// ============================
//  Puerto
// ============================
process.env.PORT = process.env.PORT || 3000;

// ==============================
//       ENTORNO
// ==============================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ===============================
//   Base de Datos
// ===============================

let urlDB;


if (process.env.NODE_ENV === 'dev') {

    urlDB = 'mongodb://localhost:27017/cafe';

} else {

    urlDB = process.env.MONGO_URI;

}

// 'mongodb://localhost:27017/cafe'




process.env.URLDB = urlDB;
