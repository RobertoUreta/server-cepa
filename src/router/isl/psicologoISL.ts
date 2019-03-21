
import { Router, Request, Response } from "express";
import MySQL from '../../mysql/mysql';
import restrict from '../sesion'
const psicologoISL = Router();

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

psicologoISL.put('/update_psicologoISL', restrict, (req: Request, res: Response) => {
    let body = req.body.data;
    let idPaciente = req.body.idPaciente;
    obtenerIdIngreso(idPaciente, (err: any, respuesta: Object[]) => {
        let idIngreso = JSON.parse(JSON.stringify(respuesta)).id_ingreso;
        let query = ` SELECT ref_diagnostico_dsm AS id FROM entrevista_psicologo_isl WHERE id_entrevista_psicologo_isl=${idIngreso};`
        console.log("yesliii");
        console.log('Query:   ', query)
        MySQL.ejecutarQuery(query, (err: any, resp: Object[]) => {
            let idDSM = JSON.parse(JSON.stringify(resp[0])).id;
            let query2 = ` UPDATE diagnostico_dsm SET eje_1='${body.eje1}',eje_2='${body.eje2}',
                                                        eje_3='${body.eje3}',eje_4='${body.eje4}',
                                                        eeg='${body.eeg}',impresiones_clinicas='${body.impresionesClinicas}' 
                                                        WHERE id_dsm=${idDSM};
                            UPDATE entrevista_psicologo_isl SET estado_civil='${body.estadoCivil}',num_hijos=${body.numHijos},nombre_empresa='${body.nombreEmpresa}',
                                                rol_cumple_en_empresa='${body.rolCumpleEmpresa}',tiempo_en_profesion='${body.tiempoEnProfesion}',
                                                tiempo_en_cargo='${body.tiempoEnCargo}',funciones_realizadas_en_empresa='${body.funcionesRealizadasEnEmpresa}',
                                                descripcion_cargo='${body.descripcionCargo}',horarios='${body.horarios}',limite_alcance_cargo='${body.limiteAlcanceCargo}',
                                                calidad_relaciones_interpersonales='${body.calidadRelacionesInterpersonales}',liderazgo='${body.liderazgo}',
                                                caracteristicas_jefatura='${body.caracteristicasJefatura}',tipo_contrato='${body.tipoContrato}',
                                                estabilidad='${body.estabilidad}',cambio_funciones='${body.cambioFunciones}',
                                                obligaciones_extra_contrato='${body.obligacionesExtraContrato}',menoscabo_funciones='${body.menoscaboFunciones}',
                                                medidas_proteccion_trabajador_efectividad='${body.medidasProteccionTrabajadorEfectividad}',
                                                motivaciones_diep='${body.motivacionesDiep}',sintomas='${body.sintomas}',
                                                cuando_aparecen='${body.cuandoAparecen}',cuando_intensifican='${body.cuandoIntensifican}',
                                                que_hace_al_respecto='${body.queHaceAlRespecto}',lugares_de_trabajo_actuales='${body.lugaresDeTrabajoActuales}',
                                                antiguedad_en_trabajos='${body.antiguedadEnTrabajos}',despidos_renuncias_causas='${body.despidosRenunciasCausas}',
                                                interes_motivaciones_trabajo_actual='${body.interesMotivacionesTrabajoActual}',genograma='${body.genograma}',
                                                expectativa_trabajador='${body.expectativaTrabajador}' WHERE id_entrevista_psicologo_isl=${idIngreso};`;
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





psicologoISL.get('/obtener_psicologoISL', restrict, (req: Request, res: Response) => {
    let idPaciente = req.query.idPaciente;

    obtenerIdIngreso(idPaciente, (err: any, resp: Object[]) => {
        let idIngreso = JSON.parse(JSON.stringify(resp)).id_ingreso;
        let query = ` SELECT * FROM entrevista_psicologo_isl WHERE id_entrevista_psicologo_isl=${idIngreso};`
        console.log('Query:   ', query)
        MySQL.ejecutarQuery(query, (err: any, respuesta: Object[]) => {
            let idDSM = JSON.parse(JSON.stringify(respuesta[0])).ref_diagnostico_dsm;
            let query2 = ` SELECT * FROM diagnostico_dsm WHERE id_dsm=${idDSM}`;
            console.log('Query2:   ', query2)
            MySQL.ejecutarQuery(query2, (err: any, dsm: Object[]) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }
                res.status(201).json({
                    ok: true,
                    respuesta,
                    dsm
                });
            });

        });

    });


})
export default psicologoISL;