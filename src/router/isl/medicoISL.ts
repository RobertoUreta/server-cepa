import { Router, Request, Response } from "express";
import MySQL from '../../mysql/mysql';
import restrict from '../sesion'
const medicoISL = Router();

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

medicoISL.put('/update_medicoISL', restrict, (req: Request, res: Response) => {
    let body = req.body.data;
    let idPaciente = req.body.idPaciente;
    obtenerIdIngreso(idPaciente, (err: any, respuesta: Object[]) => {
        let idIngreso = JSON.parse(JSON.stringify(respuesta)).id_ingreso;
        let query = ` UPDATE entrevista_medico_isl SET estado_civil='${body.estadoCivil}',escolaridad='${body.escolaridad}',fecha_evaluacion_medica='${body.fechaEvaluacionMedica}',
                                        anamnesis='${body.anamnesis}',territorialidad_desplaza_fuera_hogar='${body.territorialidadDesplazaFueraLugar}',
                                        patologias_medicas_psiquiatricas_previas='${body.patologiasMedicasPsiquiatricasPrevias}',consumo_sustancias='${body.consumoSustancias}',
                                        labores_realizadas='${body.laboresRealizadas}',difcultades_referidas='${body.dificultadesReferidas}',apariencia='${body.apariencia}',
                                        actitud_inicial='${body.actitudInicial}',conducta_no_verbal='${body.conductaNoVerbal}',es_acompanado='${body.esAcompanado}',
                                        oposicionalismo='${body.oposicionamiento}',sospecha_simulacion='${body.sospechaSimulacion}',sugerencia_test='${body.sugerenciaTest}',
                                        sugerencia_test_especificar='${body.sugerenciaTestEspecificar}',observaciones='${body.observaciones}',
                                        observaciones_generales='${body.observacionesGenerales}' WHERE id_entrevista_medico_isl=${idIngreso};`;
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





medicoISL.get('/obtener_medicoISL', restrict, (req: Request, res: Response) => {
    let idPaciente = req.query.idPaciente;

    obtenerIdIngreso(idPaciente, (err: any, respuesta: Object[]) => {
        let idIngreso = JSON.parse(JSON.stringify(respuesta)).id_ingreso;
        const query = ` SELECT * FROM entrevista_medico_isl WHERE id_entrevista_medico_isl=${idIngreso};`
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
export default medicoISL;