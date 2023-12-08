import { ExerciseController } from "../controllers/ExerciseController";
import { MongoExerciseRepository } from "../repositories/MongoExerciseRepository";

import { FindAllExercises } from '../../application/exercise-use-cases/FindAllExercises';
import { CreateExercise } from '../../application/exercise-use-cases/CreateExercise';
import { UpdateExerciseById } from '../../application/exercise-use-cases/UpdateExerciseById';

const exerciseRepository = new MongoExerciseRepository();

export const findAllExercises = new FindAllExercises(exerciseRepository);
export const createExercise = new CreateExercise(exerciseRepository);
export const updateExerciseById = new UpdateExerciseById(exerciseRepository);

export const exerciseController = new ExerciseController(
    findAllExercises,
    createExercise,
    updateExerciseById
);