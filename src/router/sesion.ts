import { Router, Request, Response, NextFunction } from 'express';
import MySQL from '../mysql/mysql';
const bkfd2Password = require('pbkdf2-password');
const sesion = Router();
const hasher = bkfd2Password();

sesion.get('/logout', function (req, res) {
    // destroy the user's session to log them out
    // will be re-created next request

    req.session!.destroy(function () {
        return res.json({
            ok: true,
            mensaje: 'logout correcto'
        })
    });
});

export function restrict(req: Request, res: Response, next: NextFunction) {
    if (req.session!.user) {
        //console.log("ESTE ES EL REQ.SESSION");
        //console.log(req.sessionID);
        //console.log(req.session!.user);
        next();
    } else {
        req.session!.error = 'Access denied!';
        return res.json({
            ok: false,
            mensaje: 'restrict failed'
        })
    }
}




sesion.get('/auth', restrict, function (req, res) {
    res.json({
        ok: true,
        mensaje: 'Auth Correcto'
    })
});



sesion.post('/login', (req: Request, res: Response) => {
    console.log('--login--');
    let pw = req.body.password;
    if (!req.body.usuario || !req.body.password) {
        res.json({
            ok: false,
            mensaje: 'Login failed'
        })
    }
    const query = `
        SELECT id_usuario, username, password, salt, nombre_rol
        FROM usuario,rol_usuario
        WHERE username='${req.body.usuario}' AND ref_rol=id_rol_usuario
    `;
    MySQL.ejecutarQuery(query, (err: any, sesion: Object[]) => {
        if (err) {
            res.json({
                ok: false,
                error: err
            });
        } else {
            let ses = JSON.parse(JSON.stringify(sesion[0]));
            let opts = {
                password: req.body.password,//password ingresada por el usuario.
                salt: ses.salt//Salt asociado al usuario obtenido de la BD.
            }
            //Se pasan estas opts para hashear el password ingresado por el usuario y revisarlo con el hash que se encuentra en la BD.
            hasher(opts, function (err: Error, pass: String, salt: string, hash: string) {
                if (err) console.log(err);
                if (hash===ses.password) {
                    console.log('--MATCH--');
                    req.session!.regenerate(function () {
                        req.session!.user = sesion[0]
                        return res.json({
                            ok: true,
                            usuario: sesion[0]
                        });
                    });
                }
                else {
                    console.log('--PASS INCORRECTA--');
                    return res.json({
                        ok: false,
                        mensaje: 'Contraseña incorrecta :('
                    })
                }
            });
            
        }
    });
});

export default sesion;