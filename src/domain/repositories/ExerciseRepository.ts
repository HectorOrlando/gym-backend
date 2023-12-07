import { WithId, Document } from "mongodb";
import { ExerciseModel } from '../models/ExerciseModel';

export interface ExerciseRepository {
    findAllExercises(): Promise<WithId<Document>[]>;
    createExercise(exercise: ExerciseModel): Promise<void>;
}