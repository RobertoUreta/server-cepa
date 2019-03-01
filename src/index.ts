
import Server from './server/server'
import router from './router/router'
import usuario from './router/usuario/usuario'

const server = Server.init(3001);
server.app.use(router);
server.app.use(usuario);

server.start(()=>{
    console.log('Servidor corriendo en el puerto 3001');
});