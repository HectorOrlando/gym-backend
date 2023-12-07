import express, { NextFunction, Request, Response } from "express";
import { exerciseController } from "../dependency-injection/exerciseDependencies";
import { exerciseValidationMiddleware } from '../middlewares/userMiddlewares';
import { ErrorHandler } from "../error/ErrorHandler";

export const exerciseRouter = express.Router();

exerciseRouter.get('/exercises', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const exercises = await exerciseController.getAllExercises();
        res.json({ exercises });
    } catch (error) {
        ErrorHandler.handleError(error, req, res, next);
    }
});

exerciseRouter.post('/exercise', exerciseValidationMiddleware, async (req: Request, res: Response, next: NextFunction) => {
    try {
        await exerciseController.insertExercise(req);
        res.status(201).send('Exercise created successfully').end();
    } catch (error) {
        ErrorHandler.handleError(error, req, res, next);
    }
});