
import {Router,Request,Response} from 'express';
import restrict from './sesion'
import multer from 'multer';
import fs from 'fs';
const archivo = Router();

let storage = multer.diskStorage({
    destination: function (req:any, file:any, cb:any) {
        let idPaciente = 1;
        let dir = `./uploads`;
        if (!fs.existsSync(dir)){
            console.log("trueeee");
            //fs.mkdirSync(dir);
        }
      cb(null, 'src/router/uploads')
    },
    filename: function (req:any, file:any, cb:any) {
        console.log("este es el file:",file);
      cb(null, Date.now() + '-' +file.originalname )
    }
  })
  
let upload = multer({ storage: storage }).array('file');

archivo.post('/upload',restrict,(req: any, res:any) => {
    upload(req, res, function (err:any) {
     
       if (err) {
            console.log("error en el sfjsdfsd",err);
            return res.status(500).json({
                ok: false,
                err,
                mensaje:'error cualquiera'
            });
          // An unknown error occurred when uploading.
        } 
        
        return res.status(200).json({
            ok: true,
            mensaje:'esta weno'
        });
        // Everything went fine.
      })
    /*
    file.mv(`./uploads/${file.name}`,(err:any) => {
        if(err) return res.status(500).send({ message : err })
        return res.status(200).send({ message : 'File upload' })
    });*/
});


export default archivo;