import { Router, Request, Response } from "express";
import MySQL from '../../mysql/mysql';
import restrict from '../sesion'
const puestoTrabajoISL = Router();

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

puestoTrabajoISL.put('/update_puestoTrabajoISL', restrict, (req: Request, res: Response) => {
    let body = req.body.data;
    let idPaciente = req.body.idPaciente;
    obtenerIdIngreso(idPaciente, (err: any, respuesta: Object[]) => {
        let idIngreso = JSON.parse(JSON.stringify(respuesta)).id_ingreso;
        let query = ` SELECT *
                        FROM informante
                        WHERE ref_entre_puesto_trabajo=${idIngreso};`
        console.log('Query:   ', query)
        MySQL.ejecutarQuery(query, (err: any, resp: Object[]) => {
            let id1 = JSON.parse(JSON.stringify(resp[0])).id_informante;
            let id2 = JSON.parse(JSON.stringify(resp[1])).id_informante;
            let id3 = JSON.parse(JSON.stringify(resp[2])).id_informante;
            let query2 = ` UPDATE evaluacion_puesto_trabajo SET fecha_realizacion='${body.fechaRealizacion}',opinion_empresa_trabajador='${body.opinionEmpresaTrabajador}',factores_riesgo_empresa='${body.factoresRiesgoEmpresa}',
                                                acciones_mitigacion='${body.accionesMitigacion}',observaciones='${body.observaciones}',conclusion='${body.conclusion}',razon_social='${body.razonSocial}',
                                                rut='${body.rut}',codigo_ciiu='${body.codigoCiiu}',nombre_centro_trabajo='${body.nombreCentroTrabajo}',direccion='${body.direccion}',
                                                descripcion='${body.descripcion}',antiguedad='${body.antiguedadEmpresa}',antiguedad_puesto='${body.antiguedadPuesto}',eval_desempeno='${body.evalDesempeno}',
                                                cambios_pt='${body.cambiosPt}',ausentismo_enfermedad='${body.ausentismoEnfermedad}',jornada_semanal='${body.jornadaSemanal}',sistema_turnos='${body.sistemaTurnos}',
                                                obligacion_control_horarios='${body.obligacionControlHorarios}',colacion='${body.colacion}',horas_extraordinarias='${body.horasExtraordinarias}',tipo_remuneracion='${body.tipoRemuneracion}',
                                                vacaciones='${body.vacaciones}',medico_solicitante='${body.medicoSolicitante}',motivo_consulta='${body.motivoConsulta}',fuente='${body.fuente}',
                                                coordinacion_ept='${body.coordinacionEpt}',riesgo_indagar='${body.riesgoIndagar}',motivo_falta_testigos='${body.motivoFaltaTestigos}',metodo_seleccion='${body.metodoSeleccion}',
                                                registro_confidencialidad='${body.registroConfidencialidad}',cargo='${body.cargo}',descansos='${body.descansos}',control_tiempo='${body.controlTiempo}',
                                                capacitacion='${body.capacitacion}',variedad_tarea='${body.variedadTarea}',demandas_psicologicas='${body.demandasPsicologicas}',autonomia_control='${body.autonomiaControl}',
                                                ambiguedad='${body.ambiguedad}',apoyo_social='${body.apoyoSocial}',incorporacion_tec='${body.incorporacionTec}',conflictos_interpersonales='${body.conflictosInterpersonales}',
                                                condiciones_hostiles='${body.condicionesHostiles}',condiciones_deficientes='${body.condicionesDeficientes}',condiciones_agravantes='${body.condicionesAgravantes}',
                                                relacion_trabajador_companeros='${body.relacionTrabajadorCompaneros}',relacion_superior_jerarquico='${body.relacionSuperiorJerarquico}',
                                                relacion_trabajador_suboordinados='${body.relacionTrabajadorSuboordinados}',relacion_trabajador_usuarios='${body.relacionTrabajadorUsuarios}',clima_laboral_general='${body.climaLaboralGeneral}',
                                                liderazgo='${body.liderazgo}',conductas_acoso_laboral='${body.conductasAcosoLaboral}',conductas_acoso_sexual='${body.conductasAcosoSexual}' WHERE id_ept=${idIngreso};
                            UPDATE informante SET nombre='${body.nombreInf1}',cargo='${body.cargoInf1}',relacion_jerarquica='${body.relacionJerarquicaInf1}',tiempo_conoce='${body.tiempoConoceInf1}',fechas_entrevistas='${body.fechaEntrevistaInf1}',aporte_contacto='${body.aporteContactoInf1}' WHERE id_informante=${id1};
                            UPDATE informante SET nombre='${body.nombreInf2}',cargo='${body.cargoInf2}',relacion_jerarquica='${body.relacionJerarquicaInf2}',tiempo_conoce='${body.tiempoConoceInf2}',fechas_entrevistas='${body.fechaEntrevistaInf2}',aporte_contacto='${body.aporteContactoInf2}' WHERE id_informante=${id2};
                            UPDATE informante SET nombre='${body.nombreInf3}',cargo='${body.cargoInf3}',relacion_jerarquica='${body.relacionJerarquicaInf3}',tiempo_conoce='${body.tiempoConoceInf3}',fechas_entrevistas='${body.fechaEntrevistaInf3}',aporte_contacto='${body.aporteContactoInf3}' WHERE id_informante=${id3};`;
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





puestoTrabajoISL.get('/obtener_puestoTrabajoISL', restrict, (req: Request, res: Response) => {
    let idPaciente = req.query.idPaciente;

    obtenerIdIngreso(idPaciente, (err: any, respuesta: Object[]) => {
        let idIngreso = JSON.parse(JSON.stringify(respuesta)).id_ingreso;
        let query = ` SELECT *
                            FROM informante
                            WHERE ref_entre_puesto_trabajo=${idIngreso};`
        console.log('Query:   ', query)
        MySQL.ejecutarQuery(query, (err: any, informantes: Object[]) => {
            let query2 = ` SELECT * FROM evaluacion_puesto_trabajo WHERE id_ept=${idIngreso}`;
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
                    informantes,
                    respuesta
                });
            });

        });

    });


})
export default puestoTrabajoISL;