// src\core\exercise\domain\ExerciseRepository.ts

import { Exercise } from './Exercise';
import { ExerciseId } from './ExerciseId';

export interface ExerciseRepository {
  register(exercise: Exercise): Promise<void>;
  findAll(): Promise<Exercise[]>;
  findById(id: ExerciseId): Promise<Exercise>;
  update(exercise: Exercise): Promise<void>;
  delete(exercise: Exercise): Promise<void>;
}
