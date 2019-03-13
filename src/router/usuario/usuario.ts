import { Router, Request, Response } from 'express';
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
        let query = `INSERT INTO usuario(nombre,apellido_paterno,apellido_materno,rut,genero,username,password,salt,color,telefono_trabajo,telefono_movil,correo,horas_semanales,nombre_contacto_emergencia,telefono_contacto_emergencia,estado,ref_rol,ref_supervisor) VALUES('${obj.nombre}','${obj.apellidoPaterno}','${obj.apellidoMaterno}','${obj.rut}','${obj.genero}','${obj.usuario}','${hash}','${salt}','${obj.color}','${obj.telefonoTrabajo}','${obj.telefonoMovil}','${obj.correo}',${obj.horasSemanales},'${obj.nombreContactoEmergencia}','${obj.telefonoContactoEmergencia}',b'${estado}',${obj.rolID},${obj.supervisorID});`;
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
export default usuario;