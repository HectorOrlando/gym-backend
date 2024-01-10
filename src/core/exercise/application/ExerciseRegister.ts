// src\core\exercise\application\ExerciseRegister.ts

import { Exercise } from "../domain/Exercise";
import { ExerciseRepository } from "../domain/ExerciseRepository";

type Request = {
    name: string;
    typeOfExercise: string;
    series: number;
    repetitions: string;
    rest: number;
    weight: number;
}

export class ExerciseRegister {
    public constructor(private readonly repository: ExerciseRepository) { }

    public async run(request: Request): Promise<void> {
        const exercise = Exercise.register(
            request.name,
            request.typeOfExercise,
            request.series,
            request.repetitions,
            request.rest,
            request.weight);

        await this.repository.register(exercise);
    }
}