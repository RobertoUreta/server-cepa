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


historial.get('/obtenerHistorialPsicologico', restrict, (req: Request, res: Response) => {

    let idPaciente = req.query.id_paciente
    let idUsuario = req.query.id_usuario

    obtenerIdIngreso(idPaciente, (err: any, response: Object[]) => {
        let idIngreso = JSON.parse(JSON.stringify(response)).id_ingreso;
        obtenerSesionPsicologica(idIngreso, idUsuario, (err: any, response: Object[]) => {
            res.json({
                ok: true,
                response
            });
        })

    })
    const query = ``
})

historial.get('/obtenerHistorialPsiquiatrico', restrict, (req: Request, res: Response) => {

    let idPaciente = req.query.id_paciente
    let idUsuario = req.query.id_usuario

    obtenerIdIngreso(idPaciente, (err: any, response: Object[]) => {
        let idIngreso = JSON.parse(JSON.stringify(response)).id_ingreso;
        obtenerSesionPsiquiatrica(idIngreso, idUsuario, (err: any, response: Object[]) => {
            res.json({
                ok: true,
                response
            });
        })

    })
    const query = ``
})

historial.put('/updateRegistroPsicologico', restrict, (req: Request, res: Response) => {
    var body = req.body.data;
    var id = req.body.id;

    const query = `UPDATE registro_sesion_psicologica SET diagnostico=${body.diagnostico},
            tratamiento=${body.tratamiento}, seguimiento=${body.seguimiento},quien_asiste="${body.quienAsiste}",
            descripcion_llegada="${body.descripcionLlegada}", objetivo_sesion="${body.objetivoSesion}",
            intervencion_resultado="${body.intervencionResultado}",conducta_observada="${body.conductaObservada}",
            descripcion_retiro="${body.descripcionRetiro}",indicaciones ="${body.indicaciones}",notas_sesion="${body.notasSesion}",
            tipo_tratamiento="${body.tipoTratamiento}"
            WHERE id_registro_sesion_psicologica =${id}`


    MySQL.ejecutarQuery(query, (err: any, datosad: Object[]) => {
        console.log(datosad);
        if (err) {
            res.status(400).json({
                ok: false,
                error: err
            });
        } else {
            console.log("Se actualizaron correctamente la sesion")
            res.json({
                ok: true,
            });
        }
    });
})



export default historial 