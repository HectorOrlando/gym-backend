// src\core\user\application\UserRegister.ts

import { User } from "../domain/User";
import { UserRepository } from "../domain/UserRepository";

type Request = {
    name: string;
    email: string;
}

export class UserRegister {
    public constructor(private readonly repository: UserRepository){
        this.repository = repository;
    }

    public async run(request: Request): Promise<void> {
        const user = User.register(request.name, request.email);
        await this.repository.register(user);
    }
}