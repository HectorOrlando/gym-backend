import { UserRepository } from "../../domain/repositories/UserRepository";
import { UserModel } from '../../domain/models/UserModel';

type userType = {
    name: string;
    email: string;
}

export class CreateUser {
    constructor(private userRepository: UserRepository) {
        this.userRepository = userRepository;
    }

    async run(userType: UserModel) {
        await this.userRepository.createUser(userType);
    }
}