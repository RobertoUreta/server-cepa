import { Router, Request, Response } from "express";
import MySQL from '../../mysql/mysql';
import restrict from '../sesion'
const agenda = Router();


agenda.get('/obtenerSalas', restrict, (req: Request, res: Response) => {

    const query = ` SELECT * 
                    FROM sala_atencion
                    `

    MySQL.ejecutarQuery(query, (err: any, salas: Object[]) => {
        if (err) {
            res.status(400).json({
                ok: false,
                error: err
            });
        } else {
            res.json({
                ok: true,
                salas
            });
        }
    });
})

agenda.get('/max_IdSesion', restrict, (req: Request, res: Response) => {
    const query = `SELECT MAX (id_sesion) as id
                FROM sesion`

    MySQL.ejecutarQuery(query, (err: any, response: Object[]) => {
        if (err) {
            res.status(400).json({
                ok: false,
                error: err
            });
        } else {
            res.json({
                ok: true,
                response
            });
        }
    });
})

function obtenerSalaPorDia(ref_sala: Number, fecha_sesion: Number, start: String, end: String, callback: Function) {
    let query = ` SELECT COUNT(*) as cuenta, T1.hora_inicio_atencion
                FROM (  SELECT id_sesion,hora_inicio_atencion,hora_termino_atencion
                        FROM sesion
                        WHERE ref_sala = ${ref_sala} AND fecha_sesion = DATE("${fecha_sesion}")) as T1
                WHERE "${start}" >= T1.hora_inicio_atencion AND "${start}" < T1.hora_termino_atencion 
                        OR "${end}" >= T1.hora_inicio_atencion AND "${end}" < T1.hora_termino_atencion 
               `
    console.log(query)
    MySQL.ejecutarQuery(query, (err: any, respuesta: Object[]) => {
        if (err) {
            return callback(err);
        }

        return callback(null, respuesta);
    });
}


agenda.post('/insertarSesion', restrict, (req: Request, res: Response) => {
    let body = req.body

    console.log(body)

    const query = `INSERT INTO sesion(fecha_sesion,hora_inicio_atencion,hora_termino_atencion,
        descripcion_sesion,valor_sesion,tipo_sesion,estado_sesion,ref_usuario,ref_sala)
        VALUES("${body.fecha_sesion}","${body.startAux}", "${body.endAux}", "${body.descripcion_sesion}",
        "${body.valor_sesion}","${body.tipo_sesion}","${body.estado_sesion}",${body.ref_usuario},${body.ref_sala})`

    obtenerSalaPorDia(body.ref_sala, body.fecha_sesion, body.startAux, body.endAux, (err: any, respuesta: Object[]) => {
        console.log(query)
        if (respuesta !== undefined) {
            respuesta.forEach(element => {
                console.log(element)
                let cuenta = JSON.parse(JSON.stringify(element)).cuenta;
                console.log("cuenta",cuenta)
                if (cuenta != 0) {
                    console.log("me fui a la chucha")
                    res.json({
                        ok: false,
                    })
                } else {
                    MySQL.ejecutarQuery(query, (err: any, response: Object[]) => {
                        if (err) {
                            res.status(400).json({
                                ok: false,
                                error: err
                            });
                        } else {
                            res.json({
                                ok: true,
                                response
                            });
                        }
                    })
                }
            })
        }

    })

})

agenda.get('/obtenerSesiones', restrict, (req: Request, res: Response) => {
    const query = `SELECT * FROM sesion`

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
export default agenda;
