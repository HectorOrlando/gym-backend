import { ExerciseModel } from "../../domain/models/ExerciseModel";
import { ExerciseRepository } from '../../domain/repositories/ExerciseRepository';

export class CreateExercise {
    constructor(private exerciseRepository: ExerciseRepository) {
        this.exerciseRepository = exerciseRepository;
    }

    async run(exerciseRequest: ExerciseModel): Promise<void> {
        await this.exerciseRepository.createExercise(exerciseRequest);
    }
}