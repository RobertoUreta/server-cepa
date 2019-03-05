import { Router, Request, Response } from 'express';
import MySQL from '../mysql/mysql';
const cors = require('cors');
const sesion = Router();
sesion.use(cors({ origin: 'http://localhost:3000' }));



sesion.get('/identificacion', (req: Request, res: Response) => {
    let pw = req.body.pw;
    const query = `
        SELECT username
        FROM usuario
        WHERE username=${req.body.usuario} AND password=${req.body.password}
    `;
    MySQL.ejecutarQuery(query, (err: any, sesion: Object[]) => {
        if (err) {
            res.status(400).json({
                ok: false,
                error: err
            });
        } else {
            res.json({
                ok: true,
                sesion
            });
            console.log(sesion);
        }
    });
});