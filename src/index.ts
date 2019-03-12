
import Server from './server/server'
import usuario from './router/usuario/usuario'
import express from 'express'
import session from 'express-session'
import ingreso from './router/ingreso/ingreso'
import paciente from './router/paciente/paciente'
import sesion from './router/sesion'
import agenda from './router/agenda/agenda'
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
server.app.use(agenda)
server.start(()=>{
    console.log('Servidor corriendo en el puerto 3001');
});