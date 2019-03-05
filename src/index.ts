
import Server from './server/server'
import router from './router/router'
import usuario from './router/usuario/usuario'
import express from 'express'
import session from 'express-session'
import ingreso from './router/ingreso/ingreso'

const server = Server.init(3001);
server.app.use(express.urlencoded({ extended: true }));
server.app.use(express.json());
server.app.use(session({secret:'123456'}));
server.app.use(router);
server.app.use(usuario);
server.app.use(ingreso)

server.start(()=>{
    console.log('Servidor corriendo en el puerto 3001');
});