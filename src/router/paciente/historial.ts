import { Router, Request, Response } from "express";
import MySQL from '../../mysql/mysql';
import restrict from '../sesion'
const historial = Router();

function obtenerSesionPsicologica(idIngreso: Number, idUsuario: Number, callback: Function) {
    let query = `SELECT sesion.id_sesion,sesion.hora_inicio_atencion,sesion.hora_termino_atencion,sesion.fecha_sesion
                ,usuario.nombre,usuario.apellido_paterno,usuario.apellido_materno
             FROM sesion,usuario 
             WHERE ref_ingreso = ${idIngreso} AND 
                ref_usuario =${idUsuario} AND usuario.id_usuario= ${idUsuario} AND tipo_sesion ="Psicológica"
                ORDER BY DATE(fecha_sesion) DESC`
    MySQL.ejecutarQuery(query, (err: any, respuesta: Object[]) => {
        if (err) {
            console.log("err", err)
            return callback(err);
        }
        console.log(respuesta);
        return callback(null, respuesta);
    });
}

function obtenerSesionPsiquiatrica(idIngreso: Number, idUsuario: Number, callback: Function) {
    let query = `SELECT sesion.id_sesion,sesion.hora_inicio_atencion,sesion.hora_termino_atencion,sesion.fecha_sesion
                ,usuario.nombre,usuario.apellido_paterno,usuario.apellido_materno
             FROM sesion,usuario 
             WHERE ref_ingreso = ${idIngreso} AND 
                ref_usuario =${idUsuario} AND usuario.id_usuario= ${idUsuario} AND tipo_sesion ="Psiquiátrica"
                ORDER BY DATE(fecha_sesion) DESC`
    MySQL.ejecutarQuery(query, (err: any, respuesta: Object[]) => {
        if (err) {
            console.log("err", err)
            return callback(err);
        }
        console.log(respuesta);
        return callback(null, respuesta);
    });
}

function obtenerIdIngreso(idPaciente: Number, callback: Function) {
    let query = ` SELECT id_ingreso FROM ingreso WHERE ref_paciente=${idPaciente};`
    MySQL.ejecutarQuery(query, (err: any, respuesta: Object[]) => {
        if (err) {
            console.log("err", err)
            return callback(err);
        }
        console.log(respuesta);
        return callback(null, respuesta[0]);
    });
}


historial.get('/obtenerHistorialPsicologico', restrict , (req: Request , res: Response) =>{

    let idPaciente = req.query.id_paciente
    let idUsuario = req.query.id_usuario

    obtenerIdIngreso(idPaciente , (err: any , response: Object[]) => {
        let idIngreso = JSON.parse(JSON.stringify(response)).id_ingreso;
        obtenerSesionPsicologica(idIngreso, idUsuario , (err: any , response: Object[]) => {
            res.json({
                ok: true,
                response
            });
        })

    })
    const query = ``
})

historial.get('/obtenerHistorialPsiquiatrico', restrict , (req: Request , res: Response) =>{

    let idPaciente = req.query.id_paciente
    let idUsuario = req.query.id_usuario

    obtenerIdIngreso(idPaciente , (err: any , response: Object[]) => {
        let idIngreso = JSON.parse(JSON.stringify(response)).id_ingreso;
        obtenerSesionPsiquiatrica(idIngreso, idUsuario , (err: any , response: Object[]) => {
            res.json({
                ok: true,
                response
            });
        })

    })
    const query = ``
})



export default historial 