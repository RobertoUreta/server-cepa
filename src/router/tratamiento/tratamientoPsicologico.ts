import { Router, Request, Response } from "express";
import MySQL from '../../mysql/mysql';
import restrict from '../sesion'
const tratamientoPsicologico = Router();

function obtenerIdIngreso(idPaciente: Number, callback: Function) {
    let query = ` SELECT id_ingreso FROM ingreso WHERE ref_paciente=${idPaciente};`
    MySQL.ejecutarQuery(query, (err: any, respuesta: Object[]) => {
        if (err) {
            return callback(err);
        }
        console.log(respuesta);
        return callback(null, respuesta[0]);
    });
}

tratamientoPsicologico.put('/update_tratamientoPsicologico', restrict, (req: Request, res: Response) => {
    let body = req.body.data;
    let idPaciente = req.body.idPaciente;
    obtenerIdIngreso(idPaciente, (err: any, respuesta: Object[]) => {
        let idIngreso = JSON.parse(JSON.stringify(respuesta)).id_ingreso;
        let query = ` UPDATE tratamiento_psicologico SET motivo_tratamiento_psicologico='${body.motivoTratamiento}',motivo_consulta_coconstruido='${body.motivoCoconstruido}',
                                                        tipo_tratamiento='${body.tipoTratamiento}',es_interconsulta='${body.esInterconsulta}' WHERE id_tratamiento_psicologico=${idIngreso};`
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





tratamientoPsicologico.get('/obtener_tratamientoPsicologico', restrict, (req: Request, res: Response) => {
    let idPaciente = req.query.idPaciente;

    obtenerIdIngreso(idPaciente, (err: any, respuesta: Object[]) => {
        let idIngreso = JSON.parse(JSON.stringify(respuesta)).id_ingreso;
        const query = ` SELECT * FROM tratamiento_psicologico WHERE id_tratamiento_psicologico=${idIngreso};`
        MySQL.ejecutarQuery(query, (err: any, respuesta: Object[]) => {
            if (err) {
                res.status(400).json({
                    ok: false,
                    error: err
                });
            } else {
                console.log(respuesta);
                res.json({
                    ok: true,
                    respuesta
                });
            }
        });

    });


})
export default tratamientoPsicologico;