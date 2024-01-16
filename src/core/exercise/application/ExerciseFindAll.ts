// src\core\exercise\application\ExerciseFindAll.ts

import { Exercise, ExerciseRepository } from "../domain";

export class ExerciseFindAll {
    public constructor(private readonly repository: ExerciseRepository) { }

    async run(): Promise<Exercise[]> {
        return await this.repository.findAll();
    }
}