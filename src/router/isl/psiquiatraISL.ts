import { Router, Request, Response } from "express";
import MySQL from '../../mysql/mysql';
import restrict from '../sesion'
const psiquiatraISL = Router();



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

psiquiatraISL.put('/update_psiquiatraISL', restrict, (req: Request, res: Response) => {

    let body = req.body.data;
    let familiares = req.body.data.familia;
    let idPaciente = req.body.idPaciente;
    obtenerIdIngreso(idPaciente, (err: any, respuesta: Object[]) => {
        let idIngreso = JSON.parse(JSON.stringify(respuesta)).id_ingreso;
        let query = ` UPDATE entrevista_psiquiatra_isl SET estado_civil='${body.estadoCivil}',escolaridad='${body.escolaridad}',actividad='${body.actividad}',
                                            historia_familiar='${body.historiaFamiliar}',patologias_comunes='${body.patologiasComunes}',
                                            patologias_laborales='${body.patologiasLaborales}',atenciones_patologia_mental='${body.atencionesPatologiaMental}',
                                            antecedentes_familiares_salud_mental='${body.antecendentesFamiliaresSaludMental}',enfermedades_actuales_consumo='${body.enfermedadesActualesConsumo}',
                                            motivo_consulta='${body.motivoConsulta}',factores_riesgo_laboral='${body.factoresRiesgoLaboral}',sintomas='${body.sintomas}',
                                            desarrollo_sintomas='${body.desarrolloSintomas}',tratamientos_previos='${body.tratamientosPrevios}',examen_mental='${body.examenMental}',
                                            menarquia='${body.menarquia}',menopausia='${body.menopausia}',gpa='${body.gpa}',ets='${body.ets}',fur='${body.fur}',
                                            tipo='${body.tipo}',observaciones='${body.observacionesAntGinecoObstetricos}',eje_1='${body.eje1}',eje_2='${body.eje2}',eje_3='${body.eje3}',
                                            eje_4='${body.eje4}',eeg='${body.eeg}',edad_inicio='${body.edadInicio}',tipos_trabajos='${body.tiposTrabajos}',tiempo_permanencia='${body.tiempoPermanencia}',
                                            razones_cambio='${body.razonesCambio}',empleo_actual='${body.empleoActual}',funciones_por_contrato='${body.funcionesPorContrato}',
                                            impresiones_clinicas='${body.impresionesClinicas}',conclusiones_evaluacion='${body.conclusionesEvaluacion}' WHERE id_entrevista_psiquiatra=${idIngreso};`
        for (let index = 0; index < familiares.length; index++) {
            let element = familiares[index];
            let queryEliminarFamiliar = `DELETE FROM familiar_isl WHERE ref_entrevista=${idIngreso};`;
            let queryFamiliar = `INSERT INTO familiar_isl(nombre,edad,relacion_paciente,ocupacion,ref_entrevista) VALUES ('${element.nombre}',${element.edad},'${element.relacionPaciente}','${element.ocupacion}',${idIngreso});`;
            query = query + queryEliminarFamiliar + queryFamiliar;
        }
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


function obtenerFamiliares(idEntrevista: Number, callback: Function) {
    let query = ` SELECT * FROM familiar_isl WHERE ref_entrevista=${idEntrevista};`
    MySQL.ejecutarQuery(query, (err: any, respuesta: Object[]) => {
        if (err) {
            return callback(err);
        }
        console.log(respuesta);
        return callback(null, respuesta);
    });
}


psiquiatraISL.get('/obtener_psiquiatraISL', restrict, (req: Request, res: Response) => {
    let idPaciente = req.query.idPaciente;

    obtenerIdIngreso(idPaciente, (err: any, respuesta: Object[]) => {
        let idIngreso = JSON.parse(JSON.stringify(respuesta)).id_ingreso;
        console.log(idIngreso);
        obtenerFamiliares(idIngreso, (err: any, resp: Object[]) => {
            
            let familiares ="";
            if (err) {
                familiares="";
            }
            else {
                familiares = JSON.parse(JSON.stringify(resp));
                console.log(familiares);
            }
            const query = `
                        SELECT * 
                        FROM entrevista_psiquiatra_isl
                        WHERE id_entrevista_psiquiatra = ${idIngreso}
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
                        respuesta,
                        familiares
                    });
                }
            });


        });

    });


})
export default psiquiatraISL;