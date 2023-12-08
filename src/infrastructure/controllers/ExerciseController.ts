import { Request } from "express";
import { WithId, Document } from "mongodb";

import { FindAllExercises } from '../../application/exercise-use-cases/FindAllExercises';
import { CreateExercise } from "../../application/exercise-use-cases/CreateExercise";
import { UpdateExerciseById } from "../../application/exercise-use-cases/UpdateExerciseById";
import { ExerciseModel } from "../../domain/models/ExerciseModel";


export class ExerciseController {
    constructor(
        public findAllExercises: FindAllExercises,
        public createExercise: CreateExercise,
        public updateExerciseById: UpdateExerciseById

    ) { }

    async getAllExercises(): Promise<WithId<Document>[]> {
        try {
            return await this.findAllExercises.run();
        } catch (error) {
            throw error;
        }
    }

    async insertExercise(req: Request): Promise<void> {
        try {
            const exerciseData = req.body;
            await this.createExercise.run(exerciseData);
        } catch (error) {
            throw error;
        }
    }

    async putExerciseById(id: string, exercise: ExerciseModel): Promise<void> {
        try {
            await this.updateExerciseById.run(id, exercise);
        } catch (error) {
            throw error;
        }
    }
}