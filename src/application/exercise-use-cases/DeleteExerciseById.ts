import { ExerciseRepository } from '../../domain/repositories/ExerciseRepository';

export class DeleteExerciseById {
  constructor(private exerciseRepository: ExerciseRepository) {
    this.exerciseRepository = exerciseRepository;
  }

  async run(id: string): Promise<void> {
    this.exerciseRepository.deleteExerciseById(id);
  }
}
