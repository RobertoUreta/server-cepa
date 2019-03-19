import { Router, Request, Response } from "express";
import MySQL from '../../mysql/mysql';
import restrict from '../sesion'
const diagnosticoPsiquiatrico = Router();

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

diagnosticoPsiquiatrico.put('/update_diagnosticoPsiquiatrico', restrict, (req: Request, res: Response) => {
    let body = req.body.data;
    let idPaciente = req.body.idPaciente;
    obtenerIdIngreso(idPaciente, (err: any, respuesta: Object[]) => {
        let idIngreso = JSON.parse(JSON.stringify(respuesta)).id_ingreso;
        let query = ` UPDATE diagnostico_psiquiatrico SET tratamiento_psiquiatrico='${body.tratamientoPsiquiatrico}',diagnostico_dsm_eje5='${body.diagnosticoDSMeje5}',
                                            etapa_tratamiento='${body.etapaTratamiento}',observacion='${body.observacion}',fecha_cierre_psiquiatra='${body.fechaCierrePsiquiatra}' WHERE id_diagnostico_psiquiatrico=${idIngreso};`
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





diagnosticoPsiquiatrico.get('/obtener_diagnosticoPsiquiatrico', restrict, (req: Request, res: Response) => {
    let idPaciente = req.query.idPaciente;

    obtenerIdIngreso(idPaciente, (err: any, respuesta: Object[]) => {
        let idIngreso = JSON.parse(JSON.stringify(respuesta)).id_ingreso;
        const query = ` SELECT * FROM diagnostico_psiquiatrico WHERE id_diagnostico_psiquiatrico=${idIngreso};`
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
export default diagnosticoPsiquiatrico;