// src\core\exercise\infrastructure\exerciseDependencies.ts

import { ExerciseController, MongoExerciseRepository } from './';
import { ExerciseRegister } from '../application'

const exerciseRepository = new MongoExerciseRepository();

export const exerciseRegister = new ExerciseRegister(exerciseRepository);

export const exerciseController = new ExerciseController(
    exerciseRegister,
);