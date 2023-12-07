import { WithId, Document } from "mongodb";
import { ExerciseRepository } from '../../domain/repositories/ExerciseRepository';

export class FindAllExercises {
    constructor(private exerciseRepository: ExerciseRepository) {
        this.exerciseRepository = exerciseRepository;
    }

    async run(): Promise<WithId<Document>[]> {
        return await this.exerciseRepository.findAllExercises();
    }
}