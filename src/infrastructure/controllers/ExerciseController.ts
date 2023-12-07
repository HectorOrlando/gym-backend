import { Request } from "express";
import { WithId, Document } from "mongodb";

import { FindAllExercises } from '../../application/exercise-use-cases/FindAllExercises';
import { CreateExercise } from "../../application/exercise-use-cases/CreateExercise";


export class ExerciseController {
    constructor(
        public findAllExercises: FindAllExercises,
        public createExercise: CreateExercise

    ) { }

    async getAllExercises(): Promise<WithId<Document>[]> {
        return await this.findAllExercises.run();
    }

    async insertExercise(req: Request): Promise<void> {
        try {
            const exerciseData = req.body;
            await this.createExercise.run(exerciseData);
        } catch (error) {
            throw error;
        }
    }
}