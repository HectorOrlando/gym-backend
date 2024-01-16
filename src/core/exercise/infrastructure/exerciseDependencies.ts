// src\core\exercise\infrastructure\exerciseDependencies.ts

import { ExerciseController, MongoExerciseRepository } from './';
import { ExerciseRegister, ExerciseFindAll, ExerciseFindById, ExerciseUpdateById } from '../application'

const exerciseRepository = new MongoExerciseRepository();

export const exerciseRegister = new ExerciseRegister(exerciseRepository);
export const exerciseFindAll = new ExerciseFindAll(exerciseRepository);
export const exerciseFindById = new ExerciseFindById(exerciseRepository);
export const exerciseUpdateById = new ExerciseUpdateById(exerciseRepository);

export const exerciseController = new ExerciseController(
    exerciseRegister,
    exerciseFindAll,
    exerciseFindById,
    exerciseUpdateById
);