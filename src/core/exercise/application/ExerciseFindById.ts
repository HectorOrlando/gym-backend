// src\core\exercise\application\ExerciseFindById.ts

import { Exercise, ExerciseId, ExerciseRepository } from "../domain";

export class ExerciseFindById {
    public constructor(private readonly repository: ExerciseRepository) { }

    async run(id: string): Promise<Exercise> {
        return await this.repository.findById(new ExerciseId(id));
    }
}