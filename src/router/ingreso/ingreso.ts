import { Router, Request, Response } from "express";
import MySQL from '../../mysql/mysql';
import { restrict } from "../sesion";
const ingreso = Router();

ingreso.post('/insertarPaciente', restrict,(req: Request, res: Response) => {

    var body = req.body.data
    var id = req.body.id

    console.log(body.nacimiento)

    const insertDatosGenerales = `INSERT INTO adulto_contacto (id_adulto_contacto,nombre,apellido_paterno,apellido_materno,parentezco,` +
        `telefono_movil) VALUES (${id},"default","default","default","default","default");`

    const insertDatosAdicionales = `INSERT INTO datos_adicionales (id_datos_adicionales,estado,etapa,tipo_ingreso,institucion)` +
        `VALUES (${id},0,"default","default","default"); `

    const insertDatosSocioDemo = `INSERT INTO datos_sociodemograficos (id_datos_sociodemograficos,pais,region,provincia,ciudad,direccion,ingreso_familiar,` +
        `tipo_familia,estado_civil) VALUES(${id},"default","default","default","default","default",0,"default","default"); `

    const insertPaciente = `INSERT INTO paciente (nombre, apellido_paterno, apellido_materno, rut, fecha_nacimiento` +
        `, telefono_movil, telefono_fijo, correo, establecimiento_educacional, tipo_establecimiento` +
        `, prevision,ocupacion, relacion_contractual, tipo_paciente, valor_sesion, ref_adulto_contacto ` +
        `, ref_datos_adicionales, ref_datos_sociodemograficos) `
    const valuesPaciente = `VALUES("${body.nombre}", "${body.apellidoPaterno}", "${body.apellidoMaterno}", "${body.rut}"` +
        `,"${body.nacimiento}", "${body.telefonoMovil}", "${body.telefonoFijo}","${body.correo}","${body.establecimientoEducacional}"` +
        `,"${body.tipoEstablecimiento}", "${body.prevision}", "${body.ocupacion}",  "${body.relacionContractual}",` +
        ` "${body.tipoPaciente}", "${body.valorSesion}",${id},${id},${id});`

    const insertIngreso = `INSERT INTO ingreso (fecha_ingreso,es_reingreso,ref_paciente) VALUES("${body.fechaIngreso}", b'0',${id}); `
    const query = insertDatosGenerales + insertDatosAdicionales + insertDatosSocioDemo
    const queryPaciente = query + insertPaciente + valuesPaciente + insertIngreso
    console.log(queryPaciente)



    MySQL.ejecutarQuery(queryPaciente, (err: any, paciente: Object[]) => {
        console.log(paciente);
        if (err) {
            res.status(400).json({
                ok: false,
                error: err
            });
        } else {
            console.log("Se insertó correctamente en la tabla de paciente")
            res.json({
                ok: true,
            });
        }
    });
})

ingreso.put('/update_datosadicionales', restrict,(req: Request, res: Response) => {

    var body = req.body.data;
    var id = req.body.id;

    var query = `UPDATE datos_adicionales SET estado = 0 , etapa = "${body.etapa}",` +
        `tipo_ingreso="${body.tipoIngreso}", institucion ="${body.institucion}"` +
        ` WHERE id_datos_adicionales = ${id}`


    MySQL.ejecutarQuery(query, (err: any, datosad: Object[]) => {
        console.log(datosad);
        if (err) {
            res.status(400).json({
                ok: false,
                error: err
            });
        } else {
            console.log("Se actualizaron correctamente los datos adicionales")
            res.json({
                ok: true,
            });
        }
    });
})

ingreso.put('/update_datossociodemo', restrict ,(req: Request, res: Response) => {

    var body = req.body.data;
    var id = req.body.id;

    var query = `UPDATE datos_sociodemograficos SET pais = "${body.pais}",` +
        `region="${body.region}", provincia ="${body.provincia}" , ciudad="${body.ciudad}" ,` +
        `direccion="${body.direccion}",ingreso_familiar =" ${body.ingresoFamiliar}", tipo_familia="${body.tipoFamilia}"` +
        `,estado_civil =" ${body.estadoCivil}"`+
        ` WHERE id_datos_sociodemograficos = ${id}`


    MySQL.ejecutarQuery(query, (err: any, datosad: Object[]) => {
        console.log(datosad);
        if (err) {
            res.status(400).json({
                ok: false,
                error: err
            });
        } else {
            console.log("Se actualizaron correctamente los datos sociodemo")
            res.json({
                ok: true,
            });
        }
    });
})

ingreso.put('/update_adultocontacto', restrict ,(req: Request, res: Response) => {

    var body = req.body.data;
    var id = req.body.id;

    var query = `UPDATE adulto_contacto SET nombre = "${body.nombre}", apellido_paterno="${body.apellidoPaterno}"` +
        `,apellido_materno="${body.apellidoMaterno}", parentezco ="${body.parentezco}",telefono_movil="${body.telefonoMovil}"` +
        `WHERE id_adulto_contacto = ${id}`


    MySQL.ejecutarQuery(query, (err: any, datosad: Object[]) => {
        console.log(datosad);
        if (err) {
            res.status(400).json({
                ok: false,
                error: err
            });
        } else {
            console.log("Se actualizaron correctamente adultocontacto")
            res.json({
                ok: true,
            });
        }
    });
})


ingreso.get('/obtener_id_paciente', restrict,(req: Request, res: Response) => {
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
            console.log("aca", rows)
            res.json({
                ok: true,
                rows
            });
        }
    });
});


export default ingreso;