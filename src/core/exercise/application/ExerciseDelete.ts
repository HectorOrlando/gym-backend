// src\core\exercise\application\ExerciseDelete.ts

import { Exercise, ExerciseId, ExerciseRepository } from '../domain';

export class ExerciseDelete {
  public constructor(private readonly repository: ExerciseRepository) {}

  async run(id: string): Promise<void> {
    const exercise: Exercise = await this.repository.findById(new ExerciseId(id));
    exercise.delete();
    await this.repository.delete(exercise);
  }
}
