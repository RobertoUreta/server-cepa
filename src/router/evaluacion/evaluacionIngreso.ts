import { Router, Request, Response } from "express";
import MySQL from '../../mysql/mysql';
import restrict from '../sesion'
const evIngreso = Router();



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

evIngreso.put('/update_evIngreso', restrict, (req: Request, res: Response) => {

    let body = req.body.data;
    let familiares = req.body.data.familia;
    let idPaciente = req.body.idPaciente;
    let idUsuario = req.body.idUsuario;
    obtenerIdIngreso(idPaciente, (err: any, respuesta: Object[]) => {
        let idIngreso = JSON.parse(JSON.stringify(respuesta)).id_ingreso;
        let query = ` UPDATE entrevista_ingreso SET fecha_entrevista='${body.fechaEntrevista}',grupo_familiar='${body.grupoFamiliar}',
                                                observaciones='${body.observaciones}',solicitante='${body.solicitante}',motivo_consulta_paciente='${body.motivoConsultaPaciente}',
                                                motivo_consulta_institucion='${body.motivoConsultaInstitucion}',motivo_consulta_familia='${body.motivoConsultaFamilia}',
                                                soluciones_intensadas_resultados='${body.solucionesIntensadas}',principal_sintomatologia='${body.principalSintomatologia}',
                                                tratamiento_previo='${body.tratamientoPrevio}',consumo_sustancias='${body.consumoSustancias}',
                                                impresiones_clinicas='${body.impresionesClinicas}',observaciones_finales='${body.observacionesFinales}',
                                                ref_profesional=${idUsuario} WHERE id_entrevista_ingreso=${idIngreso};`
        for (let index = 0; index < familiares.length; index++) {
            let element = familiares[index];
            let queryEliminarFamiliar = `DELETE FROM familiar WHERE ref_entrevista=${idIngreso};`;
            let queryFamiliar = `INSERT INTO familiar(nombre,edad,relacion_paciente,ocupacion,ref_entrevista) VALUES ('${element.nombre}',${element.edad},'${element.relacionPaciente}','${element.ocupacion}',${idIngreso});`;
            query = query +queryEliminarFamiliar+ queryFamiliar;
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
    let query = ` SELECT * FROM familiar WHERE ref_entrevista=${idEntrevista};`
    MySQL.ejecutarQuery(query, (err: any, respuesta: Object[]) => {
        if (err) {
            return callback(err);
        }
        console.log(respuesta);
        return callback(null, respuesta);
    });
}


evIngreso.get('/obtener_evIngreso', restrict, (req: Request, res: Response) => {
    let idPaciente = req.query.idPaciente;

    obtenerIdIngreso(idPaciente, (err: any, respuesta: Object[]) => {
        let idIngreso = JSON.parse(JSON.stringify(respuesta)).id_ingreso;
        obtenerFamiliares(idIngreso, (err: any, resp: Object[]) => {
            let familiares = JSON.parse(JSON.stringify(resp));
            console.log(familiares);
            const query = `
                    SELECT * 
                    FROM entrevista_ingreso
                    WHERE id_entrevista_ingreso = ${idIngreso}
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
export default evIngreso;