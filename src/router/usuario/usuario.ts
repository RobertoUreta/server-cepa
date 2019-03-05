import { Router, Request, Response } from 'express';
import MySQL from '../../mysql/mysql';
const cors = require('cors');
const usuario = Router();
usuario.use(cors({ origin: 'http://localhost:3000' }));

usuario.get('/usuario', (req: Request, res: Response) => {
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
            console.log(usuarios);
            res.json({
                ok: true,
                usuarios
            });
        }
    });
});

usuario.get('/listaUsuario', (req: Request, res: Response) => {
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
usuario.get('/rol_usuario', (req: Request, res: Response) => {
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
            res.json({
                ok: true,
                roles
            });
        }
    });
});
usuario.post('/insertar_usuario', (req:Request, res:Response) => {
    let obj = req.body;
    console.log(obj);
    let estado = 1;
    let query = `INSERT INTO usuario(nombre,apellido_paterno,apellido_materno,rut,genero,username,password,telefono_trabajo,telefono_movil,correo,horas_semanales,nombre_contacto_emergencia,telefono_contacto_emergencia,estado,ref_rol,ref_supervisor) VALUES('${obj.nombre}','${obj.apellidoPaterno}','${obj.apellidoMaterno}','${obj.rut}','${obj.genero}','${obj.usuario}','${obj.password}','${obj.telefonoTrabajo}','${obj.telefonoMovil}','${obj.correo}',${obj.horasSemanales},'${obj.nombreContactoEmergencia}','${obj.telefonoContactoEmergencia}','${estado}',${obj.rolID},${obj.supervisorID});`;
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
export default usuario;