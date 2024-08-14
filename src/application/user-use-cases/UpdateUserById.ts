import { UserModel } from '../../domain/models/UserModel';
import { UserRepository } from '../../domain/repositories/UserRepository';

type userType = {
  name: string;
  email: string;
};

export class UpdateUserById {
  constructor(private userRepository: UserRepository) {
    this.userRepository = userRepository;
  }
  async run(id: string, userType: UserModel) {
    this.userRepository.updateUserById(id, userType);
  }
}
