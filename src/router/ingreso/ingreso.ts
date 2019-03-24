import { Router, Request, Response } from "express";
import MySQL from '../../mysql/mysql';
import { restrict } from "../sesion";
const ingreso = Router();

function obtenerIdIngreso(idPaciente: Number, callback: Function) {
    let query = `SELECT MAX(id_ingreso) AS id FROM ingreso WHERE ref_paciente=${idPaciente};`
    MySQL.ejecutarQuery(query, (err: any, respuesta: Object[]) => {
        if (err) {
            return callback(err);
        }
        console.log(respuesta);
        console.log(idPaciente);
        return callback(null, { resp: respuesta[0], id: idPaciente });
    });
}


function obtenerUltimaBateriaEstandar(callback: Function) {
    let query = `SELECT MAX(id_bateria_estandar) AS id FROM resultados_bateria_estandar`
    MySQL.ejecutarQuery(query, (err: any, respuesta: Object[]) => {
        if (err) {
            return callback(err);
        }
        return callback(null, respuesta[0]);
    });
}

function obtenerQueryISL(idIngreso: Number, callback: Function) {
    let query = ` INSERT INTO diagnostico_dsm( eje_1, eje_2, eje_3, eje_4, eeg, impresiones_clinicas) 
                VALUES ('default','default','default','default','default','default');`
    MySQL.ejecutarQuery(query, (err: any, respuesta1: Object[]) => {
        if (err) {
            console.log("errrrrorrrs");
            return callback(err);
        }
        let query2=`SELECT MAX(id_dsm) AS id FROM diagnostico_dsm;`;
        MySQL.ejecutarQuery(query2, (err: any, respuesta: Object[]) => {
            if (err) {
                console.log("errrrrorrrs");
                return callback(err);
            }
            let aux = JSON.parse(JSON.stringify(respuesta[0]));
            console.log("Este es auxxxx: ",aux);
            let idDSM = aux.id;
            let query2 = ` INSERT INTO entrevista_psicologo_isl(id_entrevista_psicologo_isl, estado_civil, num_hijos, nombre_empresa, rol_cumple_en_empresa, tiempo_en_profesion, tiempo_en_cargo, funciones_realizadas_en_empresa, descripcion_cargo, horarios, limite_alcance_cargo, calidad_relaciones_interpersonales, liderazgo, caracteristicas_jefatura, tipo_contrato, estabilidad, cambio_funciones, obligaciones_extra_contrato, menoscabo_funciones, medidas_proteccion_trabajador_efectividad, motivaciones_diep, sintomas, cuando_aparecen, cuando_intensifican, que_hace_al_respecto, lugares_de_trabajo_actuales, antiguedad_en_trabajos, despidos_renuncias_causas, interes_motivaciones_trabajo_actual, genograma, expectativa_trabajador, ref_diagnostico_dsm) 
                                                VALUES (${idIngreso},'default',0,
                                                        'default','default','default',
                                                        'default','default','default',
                                                        'default','default','default',
                                                        'default','default','default',
                                                        'default','default','default',
                                                        'default','default','default',
                                                        'default','default','default',
                                                        'default','default','default',
                                                        'default','default','default',
                                                        'default',${idDSM});                           
                            INSERT INTO entrevista_medico_isl(id_entrevista_medico_isl, estado_civil, escolaridad, fecha_evaluacion_medica, anamnesis, territorialidad_desplaza_fuera_hogar, patologias_medicas_psiquiatricas_previas, consumo_sustancias, labores_realizadas, difcultades_referidas, apariencia, actitud_inicial, conducta_no_verbal, es_acompanado, oposicionalismo, sospecha_simulacion, sugerencia_test, sugerencia_test_especificar, observaciones, observaciones_generales) 
                            VALUES (${idIngreso},'default','default',
                                    '0000-00-00','default','default',
                                    'default','default','default',
                                    'default','default','default',
                                    'default','default',0,0,0,'default',
                                    'default','default');`;
            return callback(null, query2);
        });
    });
}



ingreso.post('/insertarPaciente', restrict, (req: Request, res: Response) => {

    var body = req.body.data
    var id = req.body.id
    let userId = req.body.loggedUser


    const insertDatosGenerales = `INSERT INTO adulto_contacto (id_adulto_contacto,nombre,apellido_paterno,apellido_materno,parentezco,` +
        `telefono_movil) VALUES (${id},"default","default","default","default","default");`

    const insertDatosAdicionales = `INSERT INTO datos_adicionales (id_datos_adicionales,estado,etapa,tipo_ingreso,institucion)` +
        `VALUES (${id},0,"default","default","default"); `

    const insertDatosSocioDemo = `INSERT INTO datos_sociodemograficos (id_datos_sociodemograficos,pais,region,provincia,ciudad,direccion,ingreso_familiar,` +
        `tipo_familia,estado_civil) VALUES(${id},"default","default","default","default","default",0,"default","default"); `

    const insertPaciente = `INSERT INTO paciente (nombre, apellido_paterno, apellido_materno, rut, fecha_nacimiento` +
        `, telefono_movil, telefono_fijo, correo, establecimiento_educacional, tipo_establecimiento` +
        `, prevision,ocupacion, relacion_contractual, tipo_paciente, valor_sesion, ref_adulto_contacto ` +
        `, ref_datos_adicionales, ref_datos_sociodemograficos) `
    const valuesPaciente = `VALUES("default", "default", "default", "12345678"` +
        `,"${body.fechaIngreso}", "default", "default","default@default.com","default"` +
        `,"default", "default", "default",  "default",` +
        ` "default", "default",${id},${id},${id});`

    const insertIngreso = `INSERT INTO ingreso (fecha_ingreso,es_reingreso,ref_paciente) VALUES("${body.fechaIngreso}", 0,${id}); `

    const query = insertDatosGenerales + insertDatosAdicionales + insertDatosSocioDemo
    const queryPaciente = query + insertPaciente + valuesPaciente + insertIngreso



    MySQL.ejecutarQuery(queryPaciente, (err: any, paciente: Object[]) => {
        if (err) {
            res.status(400).json({
                ok: false,
                error: err
            });
        } else {
            obtenerIdIngreso(id, (err: any, resp: Object[]) => {
                let aux = JSON.parse(JSON.stringify(resp))
                let idIngreso = aux.resp.id;
                let queryTamizaje = ` INSERT INTO tamizaje (id_tamizaje, nombre_solicitante, fecha_solicitud, horario_disponible, nivel_urgencia, pregunta_sintomatologia,pregunta_malestar,pregunta_observaciones,ref_profesional) 
                                        VALUES (${idIngreso}, 'default', 'default', 'default', 'default', 'default', 'default', 'default', ${userId});`
                let queryEvIngreso = ` INSERT INTO entrevista_ingreso(id_entrevista_ingreso, fecha_entrevista, grupo_familiar, observaciones, solicitante, motivo_consulta_paciente, motivo_consulta_institucion, motivo_consulta_familia, soluciones_intensadas_resultados, principal_sintomatologia, tratamiento_previo, consumo_sustancias, impresiones_clinicas, observaciones_finales, ref_profesional)
                                        VALUES (${idIngreso},'0000-00-00','default','default','default','default','default','default','default','default','default','default','default','default',${userId});`
                let queryEvPsicologica = ` INSERT INTO entrevista_psicologica(id_entrevista_psicologica, fecha_entrevista, genograma, ecomapa, recursos_individuales_familiares, impresiones_clinicas, relaciones_interpersonales, relacion_terapeuta, diagnostico_nosologico, diagnostico_descriptivo, motivo_consulta_coconstruido, observaciones) 
                                                                    VALUES (${idIngreso},'0000-00-00','default','default','default','default','default','default','default','default','default','default');`
                let queryEntrevistaPsiquiatra = ` INSERT INTO anamnesis_remota(id_anamnesis_remota,hta,dm,tbc,epi,tec,p_tiroideos,alergias,cirugias,hospitalizacion,accidentes,ant_psiquiatrico,intento_suicida,observaciones) 
                                                    VALUES (${idIngreso},0,0,0,0,0,0,0,0,0,0,0,0,'default');
                                                    INSERT INTO ant_gineco_obstetricos(id_ant_gin_obs,menarquia,menopausia,gpa,ets,fur,tipo,observaciones) 
                                                    VALUES (${idIngreso},0,0,0,0,0,0,'default');
                                                    INSERT INTO habitos(id_habitos,oh,thc,tabaco,alucinogeno,anorexigeno,estimulante,solvente,otro,observaciones) 
                                                    VALUES (${idIngreso},0,0,0,0,0,0,0,'default','default');
                                                    INSERT INTO ent_psiq_antecedente_familiar(id_antec_familiar,medicos,psquiatricos,depresion,oh_drogas,suicidios,homicidios,otros)
                                                    VALUES (${idIngreso},'default','default','default','default','default','default','default');
                                                    INSERT INTO indicaciones_plan_tratamiento(id_indic_plan_trat,farmacos,entrevista_significantes_afectivos,examenes_laboratorio,derivacion,coordinacion_psicoterapeuta,coordinacion_centro_derivacion,instrumentos_aplicar,cuidado_familiar,proximo_control,observaciones) 
                                                    VALUES (${idIngreso},'default','default','default','default','default','default','default','default','default','default');
                                                    INSERT INTO entrevista_psiquiatra(id_entrevista_ingreso,fecha_entrevista,motivo,observacion,detalle_motivo_paciente,anamnesis_proxima,hipotesis_diagnostica_dsm_v,impresiones_clinicas,ref_anamnesis_remota,ref_ant_gineco_obstetricos,ref_habitos,ref_antecedentes_familiares,ref_ind_plan_tratamiento,ref_profesional) 
                                                    VALUES (${idIngreso},'0000-00-00','default','default','default','default','default','default',${idIngreso},${idIngreso},${idIngreso},${idIngreso},${idIngreso},${userId});`;
                let queryTratamientoPsicologico = ` INSERT INTO tratamiento_psicologico(id_tratamiento_psicologico, motivo_tratamiento_psicologico, motivo_consulta_coconstruido, tipo_tratamiento, es_interconsulta) 
                                                    VALUES (${idIngreso},'default','default','default',0);`;
                let queryTratamientoPsiquiatrico = ` INSERT INTO tratamiento_psiquiatrico(id_tratamiento_psiquiatrico, motivo_consulta_psiquiatrica, motivo_consulta_coconstruido, tipo_tratamiento) 
                                                    VALUES (${idIngreso},'default','default','default');`;
                let queryDiagnosticoPsicologico = `  INSERT INTO diagnostico_psicologico(id_diagnostico_psicologico, diagnostico, subtrastorno, tipo_episodio, otro_tipo_especificacion, modalidad_tratamiento, modelo_terapeutico, otro_modelo_terapeutico, traspaso_modalidad_tratamiento, fecha_traspaso_mod_tratamiento, fecha_cierre_psicologico) 
                                                    VALUES (${idIngreso},'default','default','default','default','default','default','default',0,'0000-00-00','0000-00-00');`;
                let queryDiagnosticoPsiquiatrico = ` INSERT INTO diagnostico_psiquiatrico(id_diagnostico_psiquiatrico, tratamiento_psiquiatrico, diagnostico_dsm_eje5, etapa_tratamiento, observacion, fecha_cierre_psiquiatra) 
                                                    VALUES (${idIngreso},'default','default','default','default','0000-00-00');`;
                let queryEpicrisisPsiquiatrica = ` INSERT INTO epicrisis_psiquiatrica(id_epicrisis_psiquiatrica, fecha_epicrisis, tipo_epicrisis, motivos, diagnostico_egreso, indicaciones)
                                                     VALUES (${idIngreso},'0000-00-00','default','default','default','default');`;
                let queryBaterias = `INSERT INTO resultados_bateria_estandar(oq_45_2, sclr_90, des, lec, pcl) 
                                                    VALUES (0,0,0,0,0);
                                                    INSERT INTO resultados_bateria_estandar(oq_45_2, sclr_90, des, lec, pcl) 
                                                    VALUES (0,0,0,0,0);
                                                    INSERT INTO resultados_bateria_estandar(oq_45_2, sclr_90, des, lec, pcl) 
                                                    VALUES (0,0,0,0,0);`;
                MySQL.ejecutarQuery(queryBaterias, (err: any, respuesta: Object[]) => {
                    obtenerUltimaBateriaEstandar((err: any, resp: Object[]) => {
                        let aux = JSON.parse(JSON.stringify(resp))
                        let ultimo = aux.id;
                        let id1 = ultimo - 2;
                        let id2 = ultimo - 1;
                        let id3 = ultimo;
                        let queryEpicrisisPsico = ` INSERT INTO test_bateria_estandar(id_test_bateria_estandar, ref_proceso_diagnostico, ref_durante_proceso_interventivo, ref_finalizacion_proceso_terapeutico)
                                                    VALUES(${idIngreso}, ${id1},${id2}, ${id3});
                                                    INSERT INTO epicrisis_psicologica(id_epicrisis_psicolgica, fecha_epicrisis, tipo_epicrisis, motivos, observacion_remision_sintomas, nivel_remision, observaciones_finales, logro_alcanzado, puntuacion_observaciones_cgi, ref_test_bateria_estandar)
                                                    VALUES(${idIngreso}, '0000-00-00', 'default', 'default', 'default', 'default', 'default', 'default', 'default', ${idIngreso});`
                        obtenerQueryISL(idIngreso, (err: any, queryISL: String) => {
                            console.log(queryISL);
                            let queryIngresoISL = `INSERT INTO ingreso_isl(id_ingreso_isl,ref_entrevista_med, ref_entrevista_psico) 
                                                                            VALUES (${idIngreso},${idIngreso},${idIngreso}); `;
                            let queryUpdate = ` UPDATE ingreso SET ref_tratamiento_psicologico=${idIngreso},ref_tratamiento_psiquiatrico=${idIngreso},ref_epicrisis_psiquiatrica=${idIngreso},ref_epicrisis_psicologica=${idIngreso},ref_diagnostico_psicologico=${idIngreso},ref_diagnostico_psiquiatrico=${idIngreso},ref_tamizaje=${idIngreso},ref_entrevista_ingreso=${idIngreso},ref_entrevista_psicologica=${idIngreso},ref_entrevista_psiquiatrica=${idIngreso},ref_ingreso_isl=${idIngreso} WHERE id_ingreso=${idIngreso};`
                            let query = queryTamizaje + queryEvIngreso + queryEvPsicologica + queryEntrevistaPsiquiatra + queryTratamientoPsicologico + queryTratamientoPsiquiatrico + queryDiagnosticoPsicologico + queryDiagnosticoPsiquiatrico + queryEpicrisisPsico + queryEpicrisisPsiquiatrica + queryISL +queryIngresoISL + queryUpdate;
                            console.log(query)
                            MySQL.ejecutarQuery(query, (err: any, respuesta: Object[]) => {
                                if (err) {
                                    return res.status(500).json({
                                        ok: false,
                                        err
                                    });
                                }
                                console.log("Se insertó correctamente en la tabla de paciente")
                                res.json({
                                    ok: true,
                                    respuesta
                                });
                            });
                        });
                    });
                });
            })
        }
    });
})

ingreso.put('/update_datosPersonales', restrict, (req: Request, res: Response) => {
    var body = req.body.data;
    var id = req.body.id;

    var update = `UPDATE paciente SET nombre ="${body.nombre}", apellido_paterno="${body.apellidoPaterno}"
    , apellido_materno="${body.apellidoMaterno}", rut = "${body.rut}", fecha_nacimiento="${body.nacimiento}",
    telefono_movil="${body.telefonoMovil}", telefono_fijo="${body.telefonoFijo}", correo= "${body.correo}",
     establecimiento_educacional="${body.establecimientoEducacional}", tipo_establecimiento="${body.tipoEstablecimiento}",
     prevision="${body.prevision}", ocupacion="${body.ocupacion}" , relacion_contractual ="${body.relacionContractual}",
     tipo_paciente="${body.tipoPaciente}", valor_sesion ="${body.valorSesion}" WHERE id_paciente = ${id}   `

    MySQL.ejecutarQuery(update, (err: any, datosad: Object[]) => {
        console.log(datosad);
        if (err) {
            res.status(400).json({
                ok: false,
                error: err
            });
        } else {
            console.log("Se actualizaron correctamente los datos adicionales")
            res.json({
                ok: true,
            });
        }
    });

})
ingreso.put('/update_datosadicionales', restrict, (req: Request, res: Response) => {

    var body = req.body.data;
    var id = req.body.id;

    var query = `UPDATE datos_adicionales SET estado = '${body.estado}' , etapa = "${body.etapa}",` +
        `tipo_ingreso="${body.tipoIngreso}", institucion ="${body.institucion}"` +
        ` WHERE id_datos_adicionales = ${id}`


    MySQL.ejecutarQuery(query, (err: any, datosad: Object[]) => {
        console.log(datosad);
        if (err) {
            res.status(400).json({
                ok: false,
                error: err
            });
        } else {
            console.log("Se actualizaron correctamente los datos adicionales")
            res.json({
                ok: true,
            });
        }
    });
})

ingreso.put('/update_datossociodemo', restrict, (req: Request, res: Response) => {

    var body = req.body.data;
    var id = req.body.id;

    var query = `UPDATE datos_sociodemograficos SET pais = "${body.pais}",` +
        `region="${body.region}", provincia ="${body.provincia}" , ciudad="${body.ciudad}" ,` +
        `direccion="${body.direccion}",ingreso_familiar =" ${body.ingresoFamiliar}", tipo_familia="${body.tipoFamilia}"` +
        `,estado_civil ="${body.estadoCivil}"` +
        ` WHERE id_datos_sociodemograficos = ${id}`


    MySQL.ejecutarQuery(query, (err: any, datosad: Object[]) => {
        console.log(datosad);
        if (err) {
            res.status(400).json({
                ok: false,
                error: err
            });
        } else {
            console.log("Se actualizaron correctamente los datos sociodemo")
            res.json({
                ok: true,
            });
        }
    });
})

ingreso.put('/update_adultocontacto', restrict, (req: Request, res: Response) => {

    var body = req.body.data;
    var id = req.body.id;

    var query = `UPDATE adulto_contacto SET nombre = "${body.nombre}", apellido_paterno="${body.apellidoPaterno}"` +
        `,apellido_materno="${body.apellidoMaterno}", parentezco ="${body.parentezco}",telefono_movil="${body.telefonoMovil}"` +
        `WHERE id_adulto_contacto = ${id}`


    MySQL.ejecutarQuery(query, (err: any, datosad: Object[]) => {
        console.log(datosad);
        if (err) {
            res.status(400).json({
                ok: false,
                error: err
            });
        } else {
            console.log("Se actualizaron correctamente adultocontacto")
            res.json({
                ok: true,
            });
        }
    });
})


ingreso.get('/obtener_id_paciente', restrict, (req: Request, res: Response) => {
    const query = `
        SELECT MAX(id_paciente) AS id
        FROM paciente 
    `;

    MySQL.ejecutarQuery(query, (err: any, rows: Object[]) => {
        if (err) {
            res.status(400).json({
                ok: false,
                error: err
            });
        } else {
            console.log("aca", rows)
            res.json({
                ok: true,
                rows
            });
        }
    });
});


ingreso.get('/obtener_adultoContacto', restrict, (req: Request, res: Response) => {
    let idPaciente = req.query.idPaciente;
    const query = ` SELECT * FROM adulto_contacto WHERE id_adulto_contacto=${idPaciente};`
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
})


ingreso.get('/obtener_datosSocio', restrict, (req: Request, res: Response) => {
    let idPaciente = req.query.idPaciente;
    const query = ` SELECT * FROM datos_sociodemograficos WHERE id_datos_sociodemograficos=${idPaciente};`
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
})

ingreso.get('/obtener_datosAdicionales', restrict, (req: Request, res: Response) => {
    let idPaciente = req.query.idPaciente;
    const query = ` SELECT * FROM datos_adicionales WHERE id_datos_adicionales=${idPaciente};`
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
})

export default ingreso;