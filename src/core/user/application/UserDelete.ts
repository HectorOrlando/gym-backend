// src\core\user\application\UserDelete.ts

import { User } from "../domain/User";
import { UserId } from "../domain/UserId";
import { UserRepository } from "../domain/UserRepository";

export class UserDelete {
    public constructor(private readonly repository: UserRepository) {
        this.repository = repository;
    }

    public async run(id: string): Promise<void> {
        // const user: User = await this.repository.find(new UserId(id));

        // user.delete();

        await this.repository.delete(id);
    }
}