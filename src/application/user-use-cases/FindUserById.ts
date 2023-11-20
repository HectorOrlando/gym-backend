import { UserRepository } from '../../domain/repositories/UserRepository';

export class FindUserById {
    constructor(private userRepository: UserRepository) {
        this.userRepository = userRepository;
    }

    async run(id: string) {
        return await this.userRepository.findUserById(id);
    }
}