import { Router, Request, Response } from "express";
import MySQL from '../../mysql/mysql';
import restrict from '../sesion'
const diagnosticoPsicologico = Router();

function obtenerIdIngreso(idPaciente: Number, callback: Function) {
    let query = ` SELECT id_ingreso FROM ingreso WHERE ref_paciente=${idPaciente};`
    MySQL.ejecutarQuery(query, (err: any, respuesta: Object[]) => {
        if (err) {
            return callback(err);
        }
        console.log(respuesta);
        return callback(null, respuesta[0]);
    });
}

diagnosticoPsicologico.put('/update_diagnosticoPsicologico', restrict, (req: Request, res: Response) => {
    let body = req.body.data;
    let idPaciente = req.body.idPaciente;
    obtenerIdIngreso(idPaciente, (err: any, respuesta: Object[]) => {
        let idIngreso = JSON.parse(JSON.stringify(respuesta)).id_ingreso;
        let query = ` UPDATE diagnostico_psicologico SET diagnostico='${body.diagnostico}',subtrastorno='${body.subtrastorno}',tipo_episodio='${body.tipoEpisodio}',
                                            otro_tipo_especificacion='${body.otroTipoEspecificacion}',modalidad_tratamiento='${body.modalidadTratamiento}',
                                            modelo_terapeutico='${body.modeloTerapeutico}',otro_modelo_terapeutico='${body.otroModeloTerapeutico}',
                                            traspaso_modalidad_tratamiento=${body.traspasoModalidadTratamiento},fecha_traspaso_mod_tratamiento='${body.fechaTraspasoModTratamiento}',
                                            fecha_cierre_psicologico='${body.fechaCierrePsicologico}' WHERE id_diagnostico_psicologico=${idIngreso};`
        console.log('Query:   ', query)
        MySQL.ejecutarQuery(query, (err: any, respuesta: Object[]) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.status(201).json({
                ok: true,
                respuesta
            });
        });
    });
})





diagnosticoPsicologico.get('/obtener_diagnosticoPsicologico', restrict, (req: Request, res: Response) => {
    let idPaciente = req.query.idPaciente;

    obtenerIdIngreso(idPaciente, (err: any, respuesta: Object[]) => {
        let idIngreso = JSON.parse(JSON.stringify(respuesta)).id_ingreso;
        const query = ` SELECT * FROM diagnostico_psicologico WHERE id_diagnostico_psicologico=${idIngreso};`
        MySQL.ejecutarQuery(query, (err: any, respuesta: Object[]) => {
            if (err) {
                res.status(400).json({
                    ok: false,
                    error: err
                });
            } else {
                console.log(respuesta);
                res.json({
                    ok: true,
                    respuesta
                });
            }
        });

    });


})
export default diagnosticoPsicologico;