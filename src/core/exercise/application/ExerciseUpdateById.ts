// src\core\exercise\application\ExerciseUpdateById.ts

import { Exercise, ExerciseId, ExerciseRepository } from '../domain';

type Request = {
  name: string;
  typeOfExercise: string;
  series: number;
  repetitions: string;
  rest: number;
  weight: number;
};

export class ExerciseUpdateById {
  public constructor(private readonly repository: ExerciseRepository) {}

  async run(id: string, request: Request): Promise<void> {
    const exercise: Exercise = await this.repository.findById(new ExerciseId(id));
    exercise.updateName(request.name);
    exercise.updateTypeOfExercise(request.typeOfExercise);
    exercise.updateSeries(request.series);
    exercise.updateRepetitions(request.repetitions);
    exercise.updateRest(request.rest);
    exercise.updateWeight(request.weight);
    await this.repository.update(exercise);
  }
}
