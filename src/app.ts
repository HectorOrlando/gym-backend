// app.ts

import { Server } from "./infrastructure/servers/Server";

const server = new Server();    // Crea una instancia del servidor.

server.listen();    // Inicia el servidor y lo pone en escucha de solicitudes.
