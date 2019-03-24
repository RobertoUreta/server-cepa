
import Server from './server/server'
import usuario from './router/usuario/usuario'
import express from 'express'
import session from 'express-session'
import ingreso from './router/ingreso/ingreso'
import paciente from './router/paciente/paciente'
import historial from './router/paciente/historial'
import sesion from './router/sesion'
import agenda from './router/agenda/agenda'
import tamizaje from './router/evaluacion/tamizaje';
import evIngreso from './router/evaluacion/evaluacionIngreso';
import evPsicologica from './router/evaluacion/evaluacionPsicologica';
import evPsiquiatrica from './router/evaluacion/evaluacionPsiquiatrica';
import tratamientoPsicologico from './router/tratamiento/tratamientoPsicologico';
import tratamientoPsiquiatrico from './router/tratamiento/tratamientoPsiquiatrico';
import diagnosticoPsicologico from './router/diagnostico/diagnosticoPsicologico';
import diagnosticoPsiquiatrico from './router/diagnostico/diagnosticoPsiquiatrico';
import epicrisisPsicologica from './router/epicrisis/epicrisisPsicologica';
import epicrisisPsiquiatrica from './router/epicrisis/epicrisisPsiquiatrica';
import psicologoISL from './router/isl/psicologoISL';
import medicoISL from './router/isl/medicoISL';
const cors = require('cors')
const server = Server.init(3001);
server.app.use(express.urlencoded({ extended: true }));
server.app.use(express.json());
server.app.use(cors({
    origin:['http://localhost:3000'],//front url
    methods:['GET','POST','PUT'],
    credentials: true}));
server.app.use(session({
    secret:'123456',
    saveUninitialized:true,
    resave:true}));
server.app.use(usuario);
server.app.use(ingreso);
server.app.use(paciente);
server.app.use(sesion);
server.app.use(tamizaje);
server.app.use(agenda);
server.app.use(evIngreso);
server.app.use(evPsicologica);
server.app.use(evPsiquiatrica);
server.app.use(historial);
server.app.use(tratamientoPsicologico);
server.app.use(tratamientoPsiquiatrico);
server.app.use(diagnosticoPsicologico);
server.app.use(diagnosticoPsiquiatrico);
server.app.use(epicrisisPsicologica);
server.app.use(epicrisisPsiquiatrica);
server.app.use(psicologoISL);
server.app.use(medicoISL);
server.start(()=>{
    console.log('Servidor corriendo en el puerto 3001');
});