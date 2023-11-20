// userMiddlewares.ts

import { Request, Response, NextFunction } from "express";
import { ErrorHandler } from "../error/ErrorHandler";

export const userValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        // Lógica para validar y procesar la solicitud antes de insertar el usuario
        if (!req.body.name || !req.body.email) {
            return res.status(400).json({ error: 'Name, Email are required fields.' });
        }
        // Si los datos son válidos, continuamos con la siguiente función de middleware o el controlador.
        next();
    } catch (error) {
        // Capturamos cualquier error y lo manejamos con ErrorHandler.
        ErrorHandler.handleError(error, req, res, next);
    }
};

export const exerciseValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.body.name ||
            !req.body.typeOfExercise ||
            !req.body.series ||
            !req.body.repetitions ||
            !req.body.rest ||
            !req.body.weight
        ) {
            return res.status(400).json({ error: 'The fields (name, typeOfExercise, series, repetitions, rest, weight) are required.' });
        }
        next();
    } catch (error) {
        ErrorHandler.handleError(error, req, res, next);
    }
}



