// src\infrastructure\routes\userRoutes.ts

import express, { NextFunction, Request, Response } from "express";
import { userController } from "../../core/user/infrastructure/userDependencies";
// import { userController } from '../dependency-injection/userDependencies';

import { ErrorHandler } from "../error/ErrorHandler";
import { userValidationMiddleware } from "../middlewares/userMiddlewares";

// Creamos el enrutador para la entidad 'usuarios'
export const userRouter = express.Router();

// Define el tipo de la solicitud de registro de usuario
type RegisterUserRequest = {
    name: string;
    email: string;
    password: string;
}

// Ruta para manejar las solicitudes POST a "/user" (registro de usuario)
userRouter.post("/user", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const body: RegisterUserRequest = req.body; // Extrae los datos del cuerpo de la solicitud y valida el formato
        const { name, email, password } = body;
        const user = { name, email, password }; // Agrupa los datos del usuario
        await userController.registerUser(user); // Llama al controlador para registrar al usuario utilizando los datos proporcionados
        res.status(201).send('User created successfully').end(); // Responde con un código de estado 201 (Created) si el registro fue exitoso
    } catch (error) {
        ErrorHandler.handleError(error, req, res, next); // Maneja los errores utilizando la clase ErrorHandler y pasa el control al siguiente middleware
    }
});

userRouter.delete("/user/:id", async (req: Request, res: Response, next: NextFunction) => {
    try {
        // await userController.removeUserById(req.params.id);
        await userController.userDelete(req.params.id);
        res.status(204).header('X-Message', 'User deleted successfully').end();
    } catch (error) {
        ErrorHandler.handleError(error, req, res, next);
    }
});

// Definir la ruta GET /users en el enrutador userRouter
// userRouter.get("/users", async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         // Obtenemos todos los usuarios desde el controlador usando el caso de uso getAllUsers
//         const users = await userController.showUser();
//         return res.json({ users });
//     } catch (error) {
//         ErrorHandler.handleError(error, req, res, next);
//     }
// });



// userRouter.post("/user", userValidationMiddleware, async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         await userController.insertUser(req);
//         res.status(201).send('User create successfully').end();
//     } catch (error) {
//         ErrorHandler.handleError(error, req, res, next);
//     }
// });

// userRouter.put("/user/:id", userValidationMiddleware, async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         await userController.putUserById(req);
//         res.status(204).header('X-Message', 'User update successfully').end();
//     } catch (error) {
//         ErrorHandler.handleError(error, req, res, next);
//     }
// });

// userRouter.delete("/user/:id", async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         await userController.removeUserById(req.params.id);
//         res.status(204).header('X-Message', 'User deleted successfully').end();
//     } catch (error) {
//         ErrorHandler.handleError(error, req, res, next);
//     }
// });


// Definir la ruta GET /users en el enrutador userRouter
// userRouter.get("/users", async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         // Obtenemos todos los usuarios desde el controlador usando el caso de uso getAllUsers
//         const users = await userController.getAllUsers();
//         return res.json({ users });
//     } catch (error) {
//         ErrorHandler.handleError(error, req, res, next);
//     }
// });

// userRouter.get("/users/:id", async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const user = await userController.getUserById(req.params.id);
//         return res.json({ user });
//     } catch (error) {
//         ErrorHandler.handleError(error, req, res, next);
//     }
// });