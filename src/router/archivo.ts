
import { Router } from 'express';
import restrict from './sesion'
import multer from 'multer';
import fs from 'fs';
import path = require('path');
import { obtenerIdIngreso } from './ingreso/funciones'
const archivo = Router();

let storage = multer.diskStorage({
    destination: function (req: any ,file: any, cb: any) {
        console.log(req.body.pacienteId);
        obtenerIdIngreso(req.body.pacienteId, (err: any, respuesta: Object[]) => {
            let idIngreso = JSON.parse(JSON.stringify(respuesta)).id_ingreso;
            let ruta = `uploads/${idIngreso}`
            const rutaUpload = path.resolve(__dirname, `../../${ruta}`);
            //console.log("rutaaa: ",rutaUpload);
            if (!fs.existsSync(rutaUpload)) {
                //console.log("trueeee");
                fs.mkdirSync(rutaUpload);
            }
            cb(null, ruta)
        })
    },
    filename: function (req: any, file: any, cb: any) {
        console.log("este es el file:", file);
        cb(null, Date.now() + '-' + file.originalname)
    }
})

let upload = multer({ storage: storage }).array('file');

archivo.post('/upload', restrict,(req: any, res: any) => {
    upload(req, res, function (err: any) {

        if (err) {
            console.log("error", err);
            return res.status(500).json({
                ok: false,
                err,
                mensaje: 'error cualquiera'
            });
            // An unknown error occurred when uploading.
        }

        return res.status(200).json({
            ok: true,
            mensaje: 'esta weno'
        });
        // Everything went fine.
    })
    /*
    file.mv(`./uploads/${file.name}`,(err:any) => {
        if(err) return res.status(500).send({ message : err })
        return res.status(200).send({ message : 'File upload' })
    });*/
});

archivo.get('/obtener_archivo',(req,res)=>{
    let idIngreso = req.params.tipo;
    let doc = req.params.img;
    const testFolder = 'ruta';
            fs.readdirSync(testFolder).forEach(file => {
                console.log(file);
            });
    let pathDoc= path.resolve(__dirname, `../../uploads/${idIngreso}/${doc}`);
    if (fs.existsSync(pathDoc)) {
        res.sendFile(pathDoc);
    }else{
        let noImagePath = path.resolve(__dirname,'../../uploads/no-image.jpg');
        res.sendFile(noImagePath);
    }
    
})


export default archivo;