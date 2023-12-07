import { ExerciseController } from "../controllers/ExerciseController";
import { MongoExerciseRepository } from "../repositories/MongoExerciseRepository";

import { FindAllExercises } from '../../application/exercise-use-cases/FindAllExercises';

const exerciseRepository = new MongoExerciseRepository();


export const findAllExercises = new FindAllExercises(exerciseRepository);


export const exerciseController = new ExerciseController(
    findAllExercises
);