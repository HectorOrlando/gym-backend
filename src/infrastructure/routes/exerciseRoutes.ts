import express, { NextFunction, Request, Response } from "express";
// import { exerciseController } from "../dependency-injection/exerciseDependencies";
import { exerciseController } from "../../core/exercise/infrastructure";
import { exerciseValidationMiddleware } from '../middlewares/userMiddlewares';
import { ErrorHandler } from "../error/ErrorHandler";


type RegisterExerciseRequest = {
    name: string;
    typeOfExercise: string;
    series: number;
    repetitions: string;
    rest: number;
    weight: number;
}

export const exerciseRouter = express.Router();

// exerciseRouter.get('/exercises', async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const exercises = await exerciseController.getAllExercises();
//         res.json({ exercises });
//     } catch (error) {
//         ErrorHandler.handleError(error, req, res, next);
//     }
// });

exerciseRouter.post('/exercises', exerciseValidationMiddleware, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const body: RegisterExerciseRequest = req.body;
        const { name, typeOfExercise, series, repetitions, rest, weight } = body;
        const exercise = { name, typeOfExercise, series, repetitions, rest, weight };
        await exerciseController.registerExercise(exercise);
        res.status(201).send('Exercise created successfully').end();
    } catch (error) {
        ErrorHandler.handleError(error, req, res, next);
    }
});

// exerciseRouter.put('/exercise/:id', exerciseValidationMiddleware, async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         await exerciseController.putExerciseById(req.params.id, req.body);
//         res.status(204).header('X-Message', 'Exercise update successfully').end();
//     } catch (error) {
//         ErrorHandler.handleError(error, req, res, next);
//     }
// });

// exerciseRouter.delete('/exercise/:id', async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         await exerciseController.removeExerciseById(req.params.id);
//         res.status(204).header('X-Message', 'Exercise deleted successfully').end();
//     } catch (error) {
//         ErrorHandler.handleError(error, req, res, next);
//     }
// });