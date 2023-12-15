// src\core\user\application\UserFindAll.ts

import { UserRepository } from "../domain/UserRepository";
import { User } from "../domain/User";

export class UserFindAll {
    public constructor(private readonly repository: UserRepository) {}

    public async run(): Promise<User[]> {
        return await this.repository.findAll();
    }
}