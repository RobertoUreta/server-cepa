import { Router, Request, Response } from "express";
import MySQL from '../../mysql/mysql';
import restrict from '../sesion'
import {obtenerIdIngreso} from '../ingreso/funciones'
const evPsicologica = Router();



evPsicologica.put('/update_evPsicologica', restrict, (req: Request, res: Response) => {

    let body = req.body.data;
    let idPaciente = req.body.idPaciente;
    let idUsuario = req.body.idUsuario;//agregar ref a usuario en la tabla de entrevista psicologica.
    obtenerIdIngreso(idPaciente, (err: any, respuesta: Object[]) => {
        let idIngreso = JSON.parse(JSON.stringify(respuesta)).id_ingreso;
        let query = ` UPDATE entrevista_psicologica SET fecha_entrevista='${body.fechaEntrevista}',
                                                        genograma='${body.srcGenograma}',ecomapa='${body.srcEcomapa}',recursos_individuales_familiares='${body.recursosIndividualesFamiliares}',
                                                        impresiones_clinicas='${body.impresionesClinicas}',relaciones_interpersonales='${body.relacionesInterpersonales}',
                                                        relacion_terapeuta='${body.relacionTerapeuta}',diagnostico_nosologico='${body.diagnosticoNosologico}',
                                                        diagnostico_descriptivo='${body.diagnosticoDescriptivo}',motivo_consulta_coconstruido='${body.motivoConsultaCoconstruido}',
                                                        observaciones='${body.observaciones}' WHERE id_entrevista_psicologica=${idIngreso};`
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





evPsicologica.get('/obtener_evPsicologica', restrict, (req: Request, res: Response) => {
    let idPaciente = req.query.idPaciente;

    obtenerIdIngreso(idPaciente, (err: any, respuesta: Object[]) => {
        let idIngreso = JSON.parse(JSON.stringify(respuesta)).id_ingreso;
        const query = `
                    SELECT * 
                    FROM entrevista_psicologica
                    WHERE id_entrevista_psicologica = ${idIngreso}
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
export default evPsicologica;