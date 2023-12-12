// src\core\user\application\UserDelete.ts

import { User } from "../domain/User";
import { UserRepository } from "../domain/UserRepository";

export class UserDelete {
    public constructor(private readonly repository: UserRepository) {
        this.repository = repository;
    }

    public async run(id: string): Promise<void> {
        await this.repository.delete(id);
    }
}