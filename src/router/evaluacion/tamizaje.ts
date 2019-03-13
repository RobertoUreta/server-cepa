import { Router, Request, Response } from "express";
import MySQL from '../../mysql/mysql';
import restrict from '../sesion'
const tamizaje = Router();



function obtenerIdIngreso(idPaciente: Number, callback: Function) {
    let query = `SELECT id_ingreso FROM ingreso WHERE ref_paciente=${idPaciente};`
    MySQL.ejecutarQuery(query, (err: any, respuesta: Object[]) => {
        if (err) {
            return callback(err);
        }
        console.log(respuesta);
        return callback(null, respuesta[0]);
    });
}

tamizaje.put('/update_tamizaje', restrict, (req: Request, res: Response) => {

    let body = req.body.data;
    let idPaciente = req.body.idPaciente;
    let idUsuario = req.body.idUsuario;

    obtenerIdIngreso(idPaciente, (err: any, respuesta: Object[]) => {
        let idIngreso = JSON.parse(JSON.stringify(respuesta)).id_ingreso;
        let query = ` UPDATE tamizaje SET nombre_solicitante='${body.nombreSolicitante}', fecha_solicitud='${body.fechaSolicitud}',horario_disponible='${body.horarioDisponible}',nivel_urgencia='${body.nivelUrgencia}',pregunta_sintomatologia='${body.preguntaSintomatologia}',pregunta_malestar='${body.preguntaMalestar}',pregunta_observaciones='${body.preguntaObservaciones}',ref_profesional=${idUsuario} WHERE id_tamizaje=${idIngreso};`
        console.log('Query:   ', query)
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
})

tamizaje.get('/obtener_tamizaje', restrict, (req: Request, res: Response) => {
    let idPaciente = req.query.idPaciente;

    obtenerIdIngreso(idPaciente, (err: any, respuesta: Object[]) => {
        let idIngreso = JSON.parse(JSON.stringify(respuesta)).id_ingreso;
        const query = `
                    SELECT * 
                    FROM tamizaje
                    WHERE id_tamizaje = ${idIngreso}
                    `
        MySQL.ejecutarQuery(query, (err: any, respuesta: Object[]) => {
            if (err) {
                res.status(400).json({
                    ok: false,
                    error: err
                });
            } else {
                res.json({
                    ok: true,
                    respuesta
                });
            }
        });
    });


})
export default tamizaje;