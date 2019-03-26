
import {Router,Request,Response} from 'express';
const archivo = Router();
import restrict from './sesion'


archivo.post('/upload',restrict,(req: Request, res:any) => {
    console.log("el fileee: ", req.files);
    console.log("el data:  ", req.body.data);
    let file = req.files!.file
    /*
    file.mv(`./uploads/${file.name}`,(err:any) => {
        if(err) return res.status(500).send({ message : err })
        return res.status(200).send({ message : 'File upload' })
    });*/
});


export default archivo;