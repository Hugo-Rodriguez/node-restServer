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

    urlDB = 'mongodb+srv://hugo:@Titina86@redesprueba-gs73z.mongodb.net/cafe?retryWrites=true&w=majority';

}

// 'mongodb://localhost:27017/cafe'




process.env.URLDB = urlDB;
