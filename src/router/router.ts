import { Router, Request, Response} from 'express';
import MySQL from '../mysql/mysql';
const cors = require('cors');

const router = Router();
router.use(cors({origin: 'http://localhost:3000'}));

router.get('/heroes/:id', (req: Request, res:Response)=>{
    
    const id = req.params.id;
    const escapedId = MySQL.instance.conexion.escape(id);
    const query = `
        SELECT *
        FROM heroes
        WHERE id = ${escapedId}
    `;
    MySQL.ejecutarQuery(query,(err:any,heroe:Object[])=>{
        if (err) {
            res.status(400).json({
                ok: false,
                error: err
            });
        }else{
            res.json({
                ok: true,
                heroe: heroe[0]
            });
        }
    });
});

export default router;