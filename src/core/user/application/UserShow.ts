// src\core\user\application\UserShow.ts

import { WithId, Document } from "mongodb";

import { UserRepository } from "../domain/UserRepository";

export class UserShow {
    public constructor(private readonly repository: UserRepository) {
        this.repository = repository;
    }

    public async run(): Promise<WithId<Document>[]> {
        return await this.repository.show();
    }
}