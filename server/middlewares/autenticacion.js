require('colors');

const jwt = require('jsonwebtoken');


// ====================
//  Verificar Token
// ====================

let verificaToken = (req, res, next) => {

    let token = req.get('token');  //header


    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: "Token no válido"
                }
            });
        };

        req.usuario = decoded.usuario;
        next();

    })

    //console.log(token.rainbow)

    //next();

    // res.json({
    //     token: token
    // });


};

// ====================
//  Verifica AdminRole
// ====================

let verificaAdmin_Role = (req, res, next) => {

    let usuario = req.usuario;

    if (usuario.role === 'ADMIN_ROLE') {
        next();
    } else {
        return res.json({
            ok: false,
            err: {
                message: 'El usuario no es administrador'
            }
        });
    };


};


//ADMIN_ROLE


module.exports = {
    verificaToken,
    verificaAdmin_Role
}

