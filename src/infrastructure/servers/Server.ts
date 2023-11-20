// Server.ts

import dotenv from 'dotenv';
import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import { userRouter } from '../routes/userRoutes';
import { ErrorHandler } from '../error/ErrorHandler';

dotenv.config();    // Carga las variables de entorno desde .env

export class Server {
    public app: Application;
    public port: string | number;
    public usersRoutePath: string;

    constructor() {
        this.app = express();   // Creamos una instancia de Express para la aplicación
        this.port = process.env.PORT || 3000;   // Definimos la ruta base para las rutas relacionadas con usuarios
        this.usersRoutePath = '/gym';   // Definimos la ruta base para las rutas relacionadas con usuarios
        this.middleware();  // Configuramos los middleware de la aplicación
        this.routes();  // Configuramos las rutas de la aplicación
    }

    // Método para configurar los middleware de la aplicación
    middleware() {
        this.app.use(cors());   // Configura el middleware de CORS para permitir el acceso a recursos de otros servidores
        this.app.use(express.json());   // Configura el middleware para leer y analizar el cuerpo de las solicitudes como JSON
        this.app.use((error: any, request: Request, response: Response, next: NextFunction) => {
            // Configuramos el middleware global para manejar errores
            ErrorHandler.handleError(error, request, response, next);
        });
    }

    // Método para configurar las rutas de la aplicación
    routes() {
        this.app.use(this.usersRoutePath, userRouter);  // Configurar las rutas en la aplicación Express
    }

    // Método para iniciar el servidor y escuchar en el puerto configurado
    listen() {
        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en puerto: ', this.port);
        });
    }

}

