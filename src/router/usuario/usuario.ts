import { Router, Request, Response} from 'express';
import MySQL from '../../mysql/mysql';
const cors = require('cors');
const usuario = Router();
usuario.use(cors({origin: 'http://localhost:3000'}));

usuario.get('/usuario', (req: Request, res:Response)=>{
    const query = `
        SELECT id_usuario,nombre
        FROM usuario
    `;
    MySQL.ejecutarQuery(query,(err:any,usuarios:Object[])=>{
        if (err) {
            res.status(400).json({
                ok: false,
                error: err
            });
        }else{
            res.json({
                ok: true,
                usuarios
            });
        }
    });
});

export default usuario;