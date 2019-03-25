import { Router, Request, Response } from "express";
import MySQL from '../../mysql/mysql';
import restrict from '../sesion'
const historial = Router();

function obtenerSesionPsicologica(idIngreso: Number, callback: Function) {
    let query = ` SELECT *
                FROM (SELECT sesion.id_sesion,sesion.hora_inicio_atencion,sesion.hora_termino_atencion,sesion.fecha_sesion, sesion.ref_usuario,sesion.ref_registro_sesion_psicologica
                    FROM sesion WHERE ref_ingreso= ${idIngreso} AND tipo_sesion ="Psicológica") as T1 
                INNER JOIN (SELECT usuario.id_usuario,usuario.nombre,usuario.apellido_paterno,usuario.apellido_materno
                    FROM usuario) AS T2
                ON T1.ref_usuario = T2.id_usuario
             
            `
    MySQL.ejecutarQuery(query, (err: any, respuesta: Object[]) => {
        if (err) {
            console.log("err", err)
            return callback(err);
        }
        console.log("holi ObtenerSesion", respuesta);
        return callback(null, respuesta);
    });
}

function obtenerSesionPsiquiatrica(idIngreso: Number, callback: Function) {
    let query = `SELECT *
    FROM (SELECT sesion.id_sesion,sesion.hora_inicio_atencion,sesion.hora_termino_atencion,sesion.fecha_sesion, sesion.ref_usuario,sesion.ref_registro_sesion_psiquiatrica
        FROM sesion WHERE ref_ingreso= ${idIngreso} AND tipo_sesion ="Psiquiátrica") as T1 
    INNER JOIN (SELECT usuario.id_usuario,usuario.nombre,usuario.apellido_paterno,usuario.apellido_materno
        FROM usuario) AS T2
    ON T1.ref_usuario = T2.id_usuario`
    MySQL.ejecutarQuery(query, (err: any, respuesta: Object[]) => {
        if (err) {
            console.log("err", err)
            return callback(err);
        }
        console.log(respuesta);
        return callback(null, respuesta);
    });
}

function obtenerIdIngreso(idPaciente: Number, callback: Function) {
    let query = ` SELECT id_ingreso FROM ingreso WHERE ref_paciente=${idPaciente};`
    MySQL.ejecutarQuery(query, (err: any, respuesta: Object[]) => {
        if (err) {
            console.log("err", err)
            return callback(err);
        }
        console.log(respuesta);
        return callback(null, respuesta[0]);
    });
}

historial.get('/obtenerHistorialPsicologico', restrict, (req: Request, res: Response) => {

    let idPaciente = req.query.id_paciente

    obtenerIdIngreso(idPaciente, (err: any, response: Object[]) => {
        let idIngreso = JSON.parse(JSON.stringify(response)).id_ingreso;
        obtenerSesionPsicologica(idIngreso, (err: any, response: Object[]) => {
            res.json({
                ok: true,
                response
            });
        })

    })
})

historial.get('/obtenerHistorialPsiquiatrico', restrict, (req: Request, res: Response) => {

    let idPaciente = req.query.id_paciente

    obtenerIdIngreso(idPaciente, (err: any, response: Object[]) => {
        let idIngreso = JSON.parse(JSON.stringify(response)).id_ingreso;
        obtenerSesionPsiquiatrica(idIngreso, (err: any, response: Object[]) => {
            res.json({
                ok: true,
                response
            });
        })

    })
    const query = ``
})

historial.put('/updateRegistroPsicologico', restrict, (req: Request, res: Response) => {
    var body = req.body.data;
    var id = req.body.id;

    const query = `UPDATE registro_sesion_psicologica SET diagnostico=${body.diagnostico},
            tratamiento=${body.tratamiento}, seguimiento=${body.seguimiento},quien_asiste="${body.quienAsiste}",
            descripcion_llegada="${body.descripcionLlegada}", objetivo_sesion="${body.objetivoSesion}",
            intervencion_resultado="${body.intervencionResultado}",conducta_observada="${body.conductaObservada}",
            descripcion_retiro="${body.descripcionRetiro}",indicaciones ="${body.indicaciones}",notas_sesion="${body.notasSesion}",
            tipo_tratamiento="${body.tipoTratamiento}"
            WHERE id_registro_sesion_psicologica =${id}`


    MySQL.ejecutarQuery(query, (err: any, datosad: Object[]) => {
        console.log(datosad);
        if (err) {
            res.status(400).json({
                ok: false,
                error: err
            });
        } else {
            console.log("Se actualizaron correctamente la sesion")
            res.json({
                ok: true,
            });
        }
    });
})

historial.put('/updateRegistroPsiquiatrico', restrict, (req: Request, res: Response) => {
    var body = req.body.data;
    var id = req.body.id;

    const query = `UPDATE registro_sesion_psiquiatrica SET tipo_tratamiento ="${body.tipoTratamiento}", observaciones ="${body.notasSesion}"
            WHERE id_registro_sesion_psiquiatrica =${id}`

    console.log("updatepsiquiatric",query)
    MySQL.ejecutarQuery(query, (err: any, datosad: Object[]) => {
        console.log(datosad);
        if (err) {
            res.status(400).json({
                ok: false,
                error: err
            });
        } else {
            console.log("Se actualizaron correctamente la sesion psiquiatrica")
            res.json({
                ok: true,
            });
        }
    });
})

historial.get('/obtenerRegistroPsicologico', (req: Request, res: Response) => {
    let id = req.query.id;

    let query = `SELECT * FROM registro_sesion_psicologica T1, sesion T2
                WHERE T2.id_sesion =${id} AND T2.ref_registro_sesion_psicologica = T1.id_registro_sesion_psicologica`

    MySQL.ejecutarQuery(query, (err: any, response: Object[]) => {
        if (err) {
            res.status(400).json({
                ok: false,
                error: err
            })
        } else {
            res.json({
                ok: true,
                response
            })
        }
    })
})

historial.get('/obtenerRegistroPsicologico', (req: Request, res: Response) => {
    let id = req.query.id;

    let query = `SELECT * FROM registro_sesion_psicologica T1, sesion T2
                WHERE T2.id_sesion =${id} AND T2.ref_registro_sesion_psicologica = T1.id_registro_sesion_psicologica`

    MySQL.ejecutarQuery(query, (err: any, response: Object[]) => {
        if (err) {
            res.status(400).json({
                ok: false,
                error: err
            })
        } else {
            res.json({
                ok: true,
                response
            })
        }
    })
})

historial.get('/obtenerRegistroPsiquiatrico', (req: Request, res: Response) => {
    let id = req.query.id;
    let ref = req.query.ref

    let query = `SELECT * FROM registro_sesion_psiquiatrica T1, sesion T2
                WHERE T2.id_sesion =${id} AND T2.ref_registro_sesion_psiquiatrica = ${ref}`
    console.log("Query ObtenerRegistroPsiquiatrico", query)
    MySQL.ejecutarQuery(query, (err: any, response: Object[]) => {
        console.log("Respuesta en obtenerRegPsiquiatrico",response)
        if (err) {
            res.status(400).json({
                ok: false,
                error: err
            })
        } else {
            res.json({
                ok: true,
                response
            })
        }
    })
})

export default historial 