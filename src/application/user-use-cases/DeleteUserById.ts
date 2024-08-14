import { UserRepository } from '../../domain/repositories/UserRepository';

export class DeleteUserById {
  constructor(private userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async run(id: string) {
    this.userRepository.deleteUserById(id);
  }
}
