import { Router, Request, Response } from "express";
import MySQL from '../../mysql/mysql';
import restrict from '../sesion'
const evPsiquiatrica = Router();



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

evPsiquiatrica.put('/update_evPsiquiatrica', restrict, (req: Request, res: Response) => {

    let body = req.body.data;
    let idPaciente = req.body.idPaciente;
    let idUsuario = req.body.idUsuario;
    obtenerIdIngreso(idPaciente, (err: any, respuesta: Object[]) => {
        let idIngreso = JSON.parse(JSON.stringify(respuesta)).id_ingreso;
        let query = ` UPDATE entrevista_psiquiatra SET fecha_entrevista='${body.fechaEntrevista}',motivo='${body.motivo}',observacion='${body.observacion}',
                                                        detalle_motivo_paciente='${body.detalleMotivoPaciente}',anamnesis_proxima='${body.anamnesisProxima}',hipotesis_diagnostica_dsm_v='${body.hipotesisDiagnosticaDSMV}',
                                                        impresiones_clinicas='${body.impresionesClinicas}',ref_profesional=${idUsuario} WHERE id_entrevista_ingreso=${idIngreso};
                        UPDATE anamnesis_remota SET hta=${body.hta},dm=${body.dm},tbc=${body.tbc},
                                                    epi=${body.epi},tec=${body.tec},p_tiroideos=${body.pTiroideos},
                                                    alergias=${body.alergias},cirugias=${body.cirugias},
                                                    hospitalizacion=${body.hospitalizacion},accidentes=${body.accidentes},
                                                    ant_psiquiatrico=${body.antPsiquiatricos},intento_suicida=${body.intentosSuicidas},
                                                    observaciones='${body.observacionesAnamnesisRemota}' WHERE id_anamnesis_remota=${idIngreso};
                        UPDATE ant_gineco_obstetricos SET menarquia=${body.menarquia},menopausia=${body.menopausia},
                                                            gpa=${body.gpa},ets=${body.ets},fur=${body.fur},
                                                            tipo=${body.tipo},observaciones='${body.observacionesAntGinecoObstetricos}' WHERE id_ant_gin_obs=${idIngreso};
                        UPDATE habitos SET oh=${body.oh},thc=${body.thc},tabaco=${body.tabaco},
                                            alucinogeno=${body.alucinogeno},anorexigeno=${body.anorexigeno},estimulante=${body.estimulante},
                                            solvente=${body.solvente},otro='${body.otro}',
                                            observaciones='${body.observacionesHabitos}' WHERE id_habitos=${idIngreso};
                        UPDATE ent_psiq_antecedente_familiar SET medicos='${body.medicos}',psquiatricos='${body.psquiatricos}',
                                                                    depresion='${body.depresion}',oh_drogas='${body.ohDrogas}',
                                                                    suicidios='${body.suicidios}',homicidios='${body.homicidios}',
                                                                    otros='${body.otrosAntecedentesFamiliares}' WHERE id_antec_familiar=${idIngreso};
                        UPDATE indicaciones_plan_tratamiento SET farmacos='${body.farmacos}',entrevista_significantes_afectivos='${body.entrevistaSignificantesAfectivos}',
                                                                    examenes_laboratorio='${body.examenesLaboratorio}',derivacion='${body.derivacion}',
                                                                    coordinacion_psicoterapeuta='${body.coordinacionPsicoterapeuta}',coordinacion_centro_derivacion='${body.coordinacionCentroDerivacion}',
                                                                    instrumentos_aplicar='${body.instrumentosAplicar}',cuidado_familiar='${body.cuidadoFamiliar}',
                                                                    proximo_control='${body.proximoControl}',observaciones='${body.observacionesIndicacionesPlanTratamiento}' WHERE id_indic_plan_trat=${idIngreso};`
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





evPsiquiatrica.get('/obtener_evPsiquiatrica', restrict, (req: Request, res: Response) => {
    let idPaciente = req.query.idPaciente;

    obtenerIdIngreso(idPaciente, (err: any, respuesta: Object[]) => {
        let idIngreso = JSON.parse(JSON.stringify(respuesta)).id_ingreso;
        const query = `
                    SELECT T1.*, T2.*, T2.observaciones AS observacionesAnamnesisRemota,T3.*,T3.observaciones AS observacionesAntGinObs, T4.*, T4.observaciones AS observacionesHabitos, T5.*, T6.*,T6.observaciones AS observacionesPlanTratamiento
                    FROM entrevista_psiquiatra T1,anamnesis_remota T2,ant_gineco_obstetricos T3,habitos T4,ent_psiq_antecedente_familiar T5,indicaciones_plan_tratamiento T6
                    WHERE T1.id_entrevista_ingreso = ${idIngreso} AND T2.id_anamnesis_remota=${idIngreso} AND T3.id_ant_gin_obs=${idIngreso} AND T4.id_habitos=${idIngreso} AND T5.id_antec_familiar=${idIngreso} AND T6.id_indic_plan_trat=${idIngreso};
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
export default evPsiquiatrica;