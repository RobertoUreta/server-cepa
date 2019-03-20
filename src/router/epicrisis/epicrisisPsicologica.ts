
import { Router, Request, Response } from "express";
import MySQL from '../../mysql/mysql';
import restrict from '../sesion'
const epicrisisPsicologica = Router();

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

epicrisisPsicologica.put('/update_epicrisisPsicologica', restrict, (req: Request, res: Response) => {
    let body = req.body.data;
    let idPaciente = req.body.idPaciente;
    obtenerIdIngreso(idPaciente, (err: any, respuesta: Object[]) => {
        let idIngreso = JSON.parse(JSON.stringify(respuesta)).id_ingreso;
        let query = ` SELECT ref_proceso_diagnostico AS id1, 
                            ref_durante_proceso_interventivo AS id2, 
                            ref_finalizacion_proceso_terapeutico AS id3 
                            FROM test_bateria_estandar 
                            WHERE id_test_bateria_estandar=${idIngreso};`
        console.log('Query:   ', query)
        MySQL.ejecutarQuery(query, (err: any, resp: Object[]) => {
            let id1 = JSON.parse(JSON.stringify(resp[0])).id1;
            let id2 = JSON.parse(JSON.stringify(resp[0])).id2;
            let id3 = JSON.parse(JSON.stringify(resp[0])).id3;
            let query2 = ` UPDATE resultados_bateria_estandar SET oq_45_2=${body.oq452_1},sclr_90=${body.sclr90_1},
                                                                    des=${body.des_1},lec=${body.lec_1},
                                                                    pcl=${body.pcl_1} WHERE id_bateria_estandar=${id1};
                            UPDATE resultados_bateria_estandar SET oq_45_2=${body.oq452_2},sclr_90=${body.sclr90_2},
                                                                    des=${body.des_2},lec=${body.lec_2},
                                                                    pcl=${body.pcl_2} WHERE id_bateria_estandar=${id2};
                            UPDATE resultados_bateria_estandar SET oq_45_2=${body.oq452_3},sclr_90=${body.sclr90_3},
                                                                    des=${body.des_3},lec=${body.lec_3},
                                                                    pcl=${body.pcl_3} WHERE id_bateria_estandar=${id3};
                            UPDATE epicrisis_psicologica SET fecha_epicrisis='${body.fecha}',tipo_epicrisis='${body.tipoEpicrisis}',
                                                                motivos='${body.motivos}',observacion_remision_sintomas='${body.observacionRemisisionSintomas}',
                                                                nivel_remision='${body.nivelRemision}',observaciones_finales='${body.observacionesFinales}',
                                                                logro_alcanzado='${body.logroAlcanzado}',puntuacion_observaciones_cgi='${body.puntuacionObservacionesCgi}' 
                                                                WHERE id_epicrisis_psicolgica=${idIngreso};`;
            console.log('Query2:   ', query2)
            MySQL.ejecutarQuery(query2, (err: any, respuesta: Object[]) => {
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
})





epicrisisPsicologica.get('/obtener_epicrisisPsicologica', restrict, (req: Request, res: Response) => {
    let idPaciente = req.query.idPaciente;

    obtenerIdIngreso(idPaciente, (err: any, respuesta: Object[]) => {
        let idIngreso = JSON.parse(JSON.stringify(respuesta)).id_ingreso;
        let query = ` SELECT ref_proceso_diagnostico AS id1, 
                            ref_durante_proceso_interventivo AS id2, 
                            ref_finalizacion_proceso_terapeutico AS id3 
                            FROM test_bateria_estandar 
                            WHERE id_test_bateria_estandar=${idIngreso};`
        console.log('Query:   ', query)
        MySQL.ejecutarQuery(query, (err: any, resp: Object[]) => {
            let id1 = JSON.parse(JSON.stringify(resp[0])).id1 - 1;
            let id3 = JSON.parse(JSON.stringify(resp[0])).id3;
            let query2 = ` SELECT * FROM resultados_bateria_estandar WHERE id_bateria_estandar LIMIT ${id1}, ${id3}`;
            console.log('Query2:   ', query2)
            MySQL.ejecutarQuery(query2, (err: any, bateria: Object[]) => {
                let query3 = ` SELECT * FROM epicrisis_psicologica WHERE id_epicrisis_psicolgica=${idIngreso}`;
                console.log('Query3:   ', query3)
                MySQL.ejecutarQuery(query3, (err: any, respuesta: Object[]) => {
                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            err
                        });
                    }
                    res.status(201).json({
                        ok: true,
                        bateria,
                        respuesta
                    });
                });
            });

        });

    });


})
export default epicrisisPsicologica;