import { Router, Request, Response } from "express";
import MySQL from '../../mysql/mysql';
const cors = require('cors');
const paciente = Router();
paciente.use(cors({ origin: 'http://localhost:3000' }));

paciente.get('/listaPacientes', (req: Request, res: Response) => {
    const query = `
        SELECT nombre,apellido_paterno,apellido_materno,rut
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
            console.log(pacientes);
            res.json({
                ok: true,
                pacientes
            });
        }
    });
});

export default paciente;