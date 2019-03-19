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
                let queryUpdate = ` UPDATE ingreso SET ref_tratamiento_psicologico=${idIngreso},ref_tratamiento_psiquiatrico=${idIngreso},ref_diagnostico_psicologico=${idIngreso},ref_diagnostico_psiquiatrico=${idIngreso},ref_tamizaje=${idIngreso},ref_entrevista_ingreso=${idIngreso},ref_entrevista_psicologica=${idIngreso},ref_entrevista_psiquiatrica=${idIngreso} WHERE id_ingreso=${idIngreso};`
                let query = queryTamizaje + queryEvIngreso + queryEvPsicologica + queryEntrevistaPsiquiatra + queryTratamientoPsicologico + queryTratamientoPsiquiatrico + queryDiagnosticoPsicologico + queryDiagnosticoPsiquiatrico +queryUpdate;
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

    var query = `UPDATE datos_adicionales SET estado = 0 , etapa = "${body.etapa}",` +
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
        `,estado_civil =" ${body.estadoCivil}"` +
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


export default ingreso;