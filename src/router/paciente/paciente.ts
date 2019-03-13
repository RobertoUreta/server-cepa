import { Router, Request, Response } from "express";
import MySQL from '../../mysql/mysql';
import restrict from '../sesion'
const paciente = Router();

paciente.get('/listaPacientes', restrict,(req: Request, res: Response) => {
    const query = `
        SELECT id_paciente,nombre,apellido_paterno,apellido_materno,rut
        FROM paciente
        WHERE id_paciente != 1
    `;
    MySQL.ejecutarQuery(query, (err: any, pacientes: Object[]) => {
        if (err) {
            res.status(400).json({
                ok: false,
                error: err
            });
        } else {
            res.json({
                ok: true,
                pacientes
            });
        }
    });
});

paciente.get('/busquedaPacientes', restrict,(req: Request, res: Response) => {
    console.log(req)
    const query = `
        SELECT id_paciente,nombre,apellido_paterno,apellido_materno,rut
        FROM paciente
        WHERE id_paciente != 1 AND CONCAT(nombre,' ',apellido_paterno) LIKE '%${req.query.search}%'
    `;
    MySQL.ejecutarQuery(query, (err: any, pacientes: Object[]) => {
        if (err) {
            res.status(400).json({
                ok: false,
                error: err
            });
        } else {
            res.json({
                ok: true,
                pacientes
            });
        }
    });
});

paciente.get('/datosPaciente', restrict, (req: Request,res: Response) => {
    const query = `
     SELECT * 
     FROM paciente
     WHERE id_paciente = ${req.query.idPaciente}
    `

    MySQL.ejecutarQuery(query, (err: any, paciente: Object[]) => {
        if (err) {
            res.status(400).json({
                ok: false,
                error: err
            });
        } else {
            res.json({
                ok: true,
                paciente
            });
        }
    });
})
export default paciente;