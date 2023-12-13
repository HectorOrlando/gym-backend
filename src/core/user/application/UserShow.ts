// src\core\user\application\UserShow.ts

import { WithId, Document } from "mongodb";

import { UserRepository } from "../domain/UserRepository";
import { User } from "../domain/User";

export class UserShow {
    public constructor(private readonly repository: UserRepository) {
        this.repository = repository;
    }

//     public async run(): Promise<User[]> {
//         return await this.repository.show();
//     }
}