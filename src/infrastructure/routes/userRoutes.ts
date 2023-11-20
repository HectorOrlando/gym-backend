// userRouter.ts

import express, { NextFunction, Request, Response } from "express";
import { userController } from '../dependency-injection/userDependencies';
import { ErrorHandler } from "../error/ErrorHandler";

// Creamos el enrutador para la entidad 'usuarios'
export const userRouter = express.Router();

// Definir la ruta GET /users en el enrutador userRouter
userRouter.get("/users", async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Obtenemos todos los usuarios desde el controlador usando el caso de uso getAllUsers
        const users = await userController.getAllUsers();
        return res.json({ users });
    } catch (error) {
        ErrorHandler.handleError(error, req, res, next);
    }
});

