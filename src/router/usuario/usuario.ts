import { Router, Request, Response, response } from 'express';
import MySQL from '../../mysql/mysql';
import { restrict } from '../sesion';
const bkfd2Password = require('pbkdf2-password');
const usuario = Router();
const hasher = bkfd2Password();



usuario.get('/usuario', restrict, (req: Request, res: Response) => {
    const query = `
        SELECT id_usuario,nombre,apellido_paterno,apellido_materno
        FROM usuario
    `;
    MySQL.ejecutarQuery(query, (err: any, usuarios: Object[]) => {
        if (err) {
            res.status(400).json({
                ok: false,
                error: err
            });
        } else {
            //console.log(usuarios);
            res.json({
                ok: true,
                usuarios
            });
        }
    });
});

function obtenerSupervisor(idUsuario: Number, callback: Function) {
    let query = `SELECT nombre,apellido_paterno FROM usuario WHERE id_usuario=${idUsuario};`
    MySQL.ejecutarQuery(query, (err: any, respuesta: Object[]) => {
        if (err) {
            return callback(err);
        }
        return callback(null, respuesta[0]);
    });
}
function obtenerRolAsociado(idRol: Number, callback: Function) {
    let query = `SELECT nombre_rol FROM rol_usuario WHERE id_rol_usuario=${idRol};`
    MySQL.ejecutarQuery(query, (err: any, respuesta: Object[]) => {
        if (err) {
            return callback(err);
        }
        return callback(null, respuesta[0]);
    });
}
usuario.get('/obtenerUsuario', (req: Request, res: Response) => {
    var id = req.query.idUser;
    console.log("obtenerUsuario", req.query)
    const query = `SELECT *
                    FROM usuario
                    WHERE id_usuario=${id}`
    MySQL.ejecutarQuery(query, (err: any, respuesta: Object[]) => {
        if (err) {
            res.status(400).json({
                ok: false,
                error: err
            });
        } else {
            let rolID = JSON.parse(JSON.stringify(respuesta[0])).ref_rol;
            let idSupervisor = JSON.parse(JSON.stringify(respuesta[0])).ref_supervisor;
            obtenerRolAsociado(rolID, (err: any, rol: Object[]) => {
                let nombreRol = JSON.parse(JSON.stringify(rol)).nombre_rol;
                if (idSupervisor !== null) {
                    obtenerSupervisor(idSupervisor, (err: any, resp: Object[]) => {
                        if (err) {
                            return res.json({
                                ok: false,
                                error: err
                            });
                        }
                        else {
                            let supervisor = JSON.parse(JSON.stringify(resp));
                            res.json({
                                ok: true,
                                respuesta,
                                nombreRol,
                                supervisor
                            });
                        }
                    });
                }
                else {
                    res.json({
                        ok: true,
                        respuesta,
                        nombreRol
                    });
                }

            });
        }
    });
})
usuario.get('/datosUsuario', (req: Request, res: Response) => {
    var id = req.query.idUser;
    console.log("datosUsuario", req.query)
    const query = `SELECT nombre,apellido_paterno,apellido_materno
                    FROM usuario
                    WHERE id_usuario=${id}`

    MySQL.ejecutarQuery(query, (err: any, usuarios: Object[]) => {
        if (err) {
            res.status(400).json({
                ok: false,
                error: err
            });
        } else {
            console.log(usuarios);
            res.json({
                ok: true,
                usuarios
            });
        }
    });
})
usuario.get('/listaUsuario', restrict, (req: Request, res: Response) => {
    const query = `
        SELECT id_usuario,nombre,apellido_paterno,apellido_materno,nombre_rol
        FROM usuario,rol_usuario
        WHERE ref_rol=id_rol_usuario
    `;
    MySQL.ejecutarQuery(query, (err: any, usuarios: Object[]) => {
        if (err) {
            res.status(400).json({
                ok: false,
                error: err
            });
        } else {
            console.log(usuarios);
            res.json({
                ok: true,
                usuarios
            });
        }
    });
});
usuario.get('/rol_usuario', restrict, (req: Request, res: Response) => {
    console.log();
    const query = `
        SELECT id_rol_usuario, nombre_rol
        FROM rol_usuario
    `;
    MySQL.ejecutarQuery(query, (err: any, roles: Object[]) => {
        if (err) {
            res.status(400).json({
                ok: false,
                error: err
            });
        } else {
            console.log(roles)
            res.json({
                ok: true,
                roles
            });
        }
    });
});


usuario.put('/update_usuario', restrict, (req: Request, res: Response) => {
    let obj = req.body.data;
    let idUsuario = req.body.idUsuario;
    if (obj.supervisorID === "") {
        console.log("if")
        obj.supervisorID = null;
    }
    if (obj.horasSemanales === "") {
        obj.horasSemanales = 0
    }
    console.log(obj);
    let estado = 1;

    let query = `UPDATE usuario SET nombre='${obj.nombre}',apellido_paterno='${obj.apellidoPaterno}',apellido_materno='${obj.apellidoMaterno}',
                                    rut='${obj.rut}',genero='${obj.genero}',username='${obj.usuario}',
                                    color='${obj.color}',telefono_trabajo='${obj.telefonoTrabajo}',
                                    telefono_movil='${obj.telefonoMovil}',correo='${obj.correo}',horas_semanales=${obj.horasSemanales},
                                    nombre_contacto_emergencia='${obj.nombreContactoEmergencia}',telefono_contacto_emergencia='${obj.telefonoContactoEmergencia}',
                                    estado=${estado},ref_rol=${obj.rolID},ref_supervisor=${obj.supervisorID} WHERE id_usuario=${idUsuario}`;
    console.log(query)
    MySQL.ejecutarQuery(query, (err: any, respuesta: Object[]) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        res.status(201).json({
            ok: true,
            respuesta
        });
    });
});

usuario.post('/insertar_usuario', restrict, (req: Request, res: Response) => {
    let obj = req.body;
    if (obj.supervisorID === "") {
        console.log("if")
        obj.supervisorID = null;
    }
    if (obj.horasSemanales === "") {
        obj.horasSemanales = 0
    }
    console.log(obj);
    let estado = 1;
    let opts = {
        password: obj.password
    }
    hasher(opts, function (err: Error, pass: String, salt: string, hash: string) {
        if (err) throw err;
        // store the salt & hash in the "db"
        let query = `INSERT INTO usuario(nombre,apellido_paterno,apellido_materno,rut,genero,username,password,salt,color,telefono_trabajo,telefono_movil,correo,horas_semanales,nombre_contacto_emergencia,telefono_contacto_emergencia,estado,ref_rol,ref_supervisor) VALUES('${obj.nombre}','${obj.apellidoPaterno}','${obj.apellidoMaterno}','${obj.rut}','${obj.genero}','${obj.usuario}','${hash}','${salt}','${obj.color}','${obj.telefonoTrabajo}','${obj.telefonoMovil}','${obj.correo}',${obj.horasSemanales},'${obj.nombreContactoEmergencia}','${obj.telefonoContactoEmergencia}',${estado},${obj.rolID},${obj.supervisorID});`;
        console.log(query)
        MySQL.ejecutarQuery(query, (err: any, respuesta: Object[]) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.status(201).json({
                ok: true,
                respuesta
            });
        });
    });


});



usuario.put('/update_password', (req: Request, res: Response) => {
    const query = `
        SELECT password, salt
        FROM usuario
        WHERE id_usuario='${req.body.idUsuario}'
    `;
    MySQL.ejecutarQuery(query, (err: any, sesion: Object[]) => {
        if (err) {
            res.json({
                ok: false,
                error: err
            });
        } else {
            console.log(req.body);
            let ses = JSON.parse(JSON.stringify(sesion[0]));
            let opts = {
                password: req.body.data.password,//password ingresada por el usuario.
                salt: ses.salt//Salt asociado al usuario obtenido de la BD.
            }
            //Se pasan estas opts para hashear el password ingresado por el usuario y revisarlo con el hash que se encuentra en la BD.
            hasher(opts, function (err: Error, pass: String, salt: string, hash: string) {
                if (err) console.log(err);
                if (hash===ses.password) {
                    let opts = {
                        password: req.body.data.newPassword
                    }
                    hasher(opts, function (err: Error, pass: String, salt: string, hash: string) {
                        if (err) throw err;
                        // store the salt & hash in the "db"
                        let query2 = `UPDATE usuario SET password='${hash}', salt='${salt}' WHERE id_usuario=${req.body.idUsuario}`
                        MySQL.ejecutarQuery(query2, (err: any, respuesta: Object[]) => {
                            if (err) {
                                return res.status(500).json({
                                    ok: false,
                                    err
                                });
                            }
                            res.status(201).json({
                                ok: true,
                                mensaje: "Contraseña cambiada correctamente!"
                            });
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
export default usuario;