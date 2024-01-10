// src\core\exercise\infrastructure\ExerciseController.ts

import { ExerciseRegister } from "../application";

type RegisterExerciseRequest = {
    name: string;
    typeOfExercise: string;
    series: number;
    repetitions: string;
    rest: number;
    weight: number;
}

export class ExerciseController {
    constructor(
        public register: ExerciseRegister,
    ) { }

    async registerExercise(request: RegisterExerciseRequest): Promise<void> {
        const { name, typeOfExercise, series, repetitions, rest, weight } = request;
        const exercise = { name, typeOfExercise, series, repetitions, rest, weight }
        await this.register.run(exercise);
    }
}