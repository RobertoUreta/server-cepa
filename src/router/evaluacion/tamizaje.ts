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


tamizaje.post('/insertar_tamizaje', restrict, (req: Request, res: Response) => {
    let obj = req.body.aux;
    let idPaciente = req.body.idPaciente;
    let idUsuario = req.body.idUsuario;
    console.log(obj);
    obtenerIdIngreso(idPaciente, (err: any, respuesta: Object[]) => {
        let idIngreso = JSON.parse(JSON.stringify(respuesta)).id_ingreso;
        let queryTamizaje = ` INSERT INTO tamizaje (id_tamizaje, nombre_solicitante, fecha_solicitud, horario_disponible, nivel_urgencia, pregunta_sintomatologia,pregunta_malestar,pregunta_observaciones,ref_profesional) VALUES (${idIngreso}, '${obj.nombreSolicitante}', '${obj.fechaSolicitud}', '${obj.horarioDisponible}', '${obj.nivelUrgencia}', '${obj.preguntaSintomatologia}', '${obj.preguntaMalestar}', '${obj.preguntaObservaciones}', '${idUsuario}');`
        let queryUpdate = ` UPDATE ingreso SET ref_tamizaje=${idIngreso} WHERE id_ingreso=${idIngreso};`
        let query = queryTamizaje + queryUpdate;
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
export default tamizaje;