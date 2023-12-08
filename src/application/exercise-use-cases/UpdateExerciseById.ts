import { ExerciseModel } from "../../domain/models/ExerciseModel";
import { ExerciseRepository } from '../../domain/repositories/ExerciseRepository';

export class UpdateExerciseById {
    constructor(private exerciseRepository: ExerciseRepository) {
        this.exerciseRepository = exerciseRepository;
    }

    async run(id: string, exerciseRequest: ExerciseModel): Promise<void> {
        this.exerciseRepository.updateExerciseById(id, exerciseRequest);
    }
}
