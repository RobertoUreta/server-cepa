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

function obtenerSalaPorDia(ref_sala: Number, fecha_sesion: Number, start: String, end: String, callback: Function) {
    let query = `SELECT COUNT(*) as cuenta, T1.hora_inicio_atencion
                FROM (  SELECT id_sesion,hora_inicio_atencion,hora_termino_atencion
                        FROM sesion
                        WHERE ref_sala = ${ref_sala} AND fecha_sesion = DATE("${fecha_sesion}")) as T1
                WHERE "${start}" >= T1.hora_inicio_atencion AND "${start}" < T1.hora_termino_atencion 
                        OR "${end}" >= T1.hora_inicio_atencion AND "${end}" < T1.hora_termino_atencion 
                        OR "${start}" < T1.hora_inicio_atencion AND "${end}" > T1.hora_termino_atencion
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

    console.log(body.startAux)
    let inicio = `"${body.startAux}"`
    let final = `"${body.endAux}"`
    console.log("inicio",inicio,"final",final)
    if (inicio > final) {
        console.log("me fui a la chucha, no ejecuté la query")
        res.json({
            ok: false,
        })
    } else {
        obtenerSalaPorDia(body.ref_sala, body.fecha_sesion, body.startAux, body.endAux, (err: any, respuesta: Object[]) => {
            if (respuesta !== undefined) {
                respuesta.forEach(element => {
                    console.log(element)
                    let cuenta = JSON.parse(JSON.stringify(element)).cuenta;
                    console.log("cuenta", cuenta)
                    if (cuenta !== 0) {
                        console.log("me fui a la chucha")
                        res.json({
                            ok: false,
                        })
                    } else {
                        obtenerIdIngreso(body.ref_paciente, (err: any, respuesta: Object[]) => {
                            console.log("bodyrefpaciente", body.ref_paciente)
                            let idIngreso = JSON.parse(JSON.stringify(respuesta)).id_ingreso;
                            console.log("idIngreso", idIngreso)
                            const query = `INSERT INTO sesion(fecha_sesion,hora_inicio_atencion,hora_termino_atencion,
                                descripcion_sesion,valor_sesion,tipo_sesion,estado_sesion,ref_usuario,ref_ingreso,ref_sala)
                                VALUES("${body.fecha_sesion}","${body.startAux}", "${body.endAux}", "${body.descripcion_sesion}",
                                "${body.valor_sesion}","${body.tipo_sesion}","${body.estado_sesion}",${body.ref_usuario},${idIngreso},${body.ref_sala})`
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

                        })

                    }
                })
            }

        })
    }

})

function obtenerRol(ref_user: Number, callback: Function) {
    let query = `SELECT nombre_rol 
                FROM (SELECT ref_rol FROM usuario WHERE id_usuario =${ref_user}) as T1 
                INNER JOIN rol_usuario as T2
                ON T1.ref_rol = T2.id_rol_usuario`

    console.log(query)
    MySQL.ejecutarQuery(query, (err: any, respuesta: Object[]) => {
        if (err) {
            return callback(err);
        }

        return callback(null, respuesta[0]);
    });

}



agenda.get('/obtenerSesiones', restrict, (req: Request, res: Response) => {
    console.log(req.query)
    let id = req.query.id

    obtenerRol(id, (err: any, respuesta: Object[]) => {
        console.log(respuesta)
        let rol = JSON.parse(JSON.stringify(respuesta)).nombre_rol
        console.log("rol es", rol)

        if (rol === "ADMIN") {
            const query = ` 
            SELECT * 
	        FROM usuario,sesion,sala_atencion
	        WHERE usuario.id_usuario = sesion.ref_usuario AND sesion.ref_sala = sala_atencion.id_sala
                            `
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

        } else {
            const query = `
                            SELECT *,usuario.color 
                            FROM sesion,usuario 
                            WHERE ref_usuario = ${id} AND usuario.id_usuario=${id}`
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
        }
    })


})

agenda.get('/sesionPorId', (req: Request, res: Response) => {
    let id = req.query.id
    const query = `SELECT T1.*,T2.nombre AS nombre_usuario,T2.apellido_paterno, T2.apellido_materno, T3.nombre as nombre_sala
                FROM sesion T1,usuario T2 ,sala_atencion T3
                WHERE T1.id_sesion = ${id} AND t1.ref_usuario = t2.id_usuario AND T3.id_sala = T1.ref_sala
                `
    MySQL.ejecutarQuery(query, (err: any, response: Object[]) => {
        if (err) {
            res.status(400).json({
                ok: false,
                error: err
            })
        }
        else {
            res.json({
                ok: true,
                response
            })
        }
    })
})

agenda.get('/colorUsuario', (req: Request, res: Response) => {
    let id = req.query.id
    const query = `SELECT color,id_usuario FROM usuario`

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
