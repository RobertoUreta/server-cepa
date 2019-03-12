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
            console.log(salas);
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
            console.log("aca", response)
            res.json({
                ok: true,
                response
            });
        }
    });
})

agenda.post('/insertarSesion', restrict, (req: Request, res: Response) => {
    let body = req.body

    console.log(body)

    const query = `INSERT INTO sesion(fecha_sesion,hora_inicio_atencion,hora_termino_atencion,
        descripcion_sesion,valor_sesion,tipo_sesion,estado_sesion,ref_usuario,ref_sala)
        VALUES("${body.fecha_sesion}","${body.start}", "${body.end}", "${body.descripcion_sesion}",
        "${body.valor_sesion}","${body.tipo_sesion}","${body.estado_sesion}",${body.ref_usuario},${body.ref_sala})`

    console.log(query)
    MySQL.ejecutarQuery(query, (err: any, response: Object[]) => {
        if (err) {
            res.status(400).json({
                ok: false,
                error: err
            });
        } else {
            console.log(response);
            res.json({
                ok: true,
                response
            });
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
            console.log(response)
            res.json({
                ok: true,
                response
            })
        }
    })
})
export default agenda;
