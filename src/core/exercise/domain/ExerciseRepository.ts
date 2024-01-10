// src\core\exercise\domain\ExerciseRepository.ts

import { Exercise } from "./Exercise";
import { ExerciseId } from "./ExerciseId";

export interface ExerciseRepository {
    register(exercise: Exercise): Promise<void>;
}