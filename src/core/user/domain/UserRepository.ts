// src\core\user\domain\UserRepository.ts
import { WithId, Document } from "mongodb";
import { User } from "./User";

export interface UserRepository {
    register(user: User): Promise<void>;
    show(): Promise<WithId<Document>[]>;
    delete(id: string): Promise<void>;
}