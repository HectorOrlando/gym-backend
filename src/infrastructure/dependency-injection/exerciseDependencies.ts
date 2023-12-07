import { ExerciseController } from "../controllers/ExerciseController";
import { MongoExerciseRepository } from "../repositories/MongoExerciseRepository";

import { FindAllExercises } from '../../application/exercise-use-cases/FindAllExercises';
import { CreateExercise } from '../../application/exercise-use-cases/CreateExercise';

const exerciseRepository = new MongoExerciseRepository();

export const findAllExercises = new FindAllExercises(exerciseRepository);
export const createExercise = new CreateExercise(exerciseRepository);

export const exerciseController = new ExerciseController(
    findAllExercises,
    createExercise
);