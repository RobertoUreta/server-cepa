import { Router, Request, Response } from "express";
import MySQL from '../../mysql/mysql';
const cors = require('cors');
const ingreso = Router();
ingreso.use(cors({ origin: 'http://localhost:3000' }));

ingreso.post('/ingreso', (req: Request, res: Response) => {

    var body = req.body.data
    console.log(body)
    const insertPaciente = "INSERT INTO paciente(nombre, apellido_paterno, apellido_materno, rut, fecha_nacimiento" +
                            ", telefono_movil, telefono_fijo, correo, establecimiento_educacional, tipo_establecimiento"+
                            ", prevision,ocupacion, relacion_contractual, tipo_paciente, valor_sesion, ref_adulto_contacto"+
                            ", ref_datos_adicionales, ref_datos_sociodemograficos, ref_entrevista_isl) "
    const valuesPaciente = `VALUES("${body.nombre}", "${body.apellidoPaterno}", "${body.apellidoMaterno}", "${body.rut}"` +
                            `,"${body.fechaNacimiento}", "${body.telefonoMovil}", "${body.telefonoFijo}","${body.correo}","${body.establecimientoEducacional}"`+
                            `,"${body.tipoEstablecimiento}", "${body.prevision}", "${body.ocupacion}",  "${body.relacionContractual}",`+
                            ` "${body.tipoPaciente}", "${body.valorSesion}",0,0,0,0);`
    const queryPaciente = insertPaciente + valuesPaciente
    
    MySQL.ejecutarQuery(queryPaciente, (err: any) => {
        if (err) {
            res.status(400).json({
                ok: false,
                error: err
            });
        } else {
            res.json({
                ok: true,
            });
        }
    });
    console.log(queryPaciente)
})

ingreso.get('/obtener_id_paciente', (req: Request, res: Response) => {
    const query = `
        SELECT MAX(id_paciente) AS id
        FROM paciente 
    `;
    
    MySQL.ejecutarQuery(query, (err: any, rows: Object[]) => {
        if (err) {
            res.status(400).json({
                ok: false,
                error: err
            });
        } else {
            console.log("aca",rows)
            res.json({
                ok: true,
                rows
            });
        }
    });
});

export default ingreso;