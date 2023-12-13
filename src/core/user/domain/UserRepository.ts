// src\core\user\domain\UserRepository.ts

import { User } from "./User";

export interface UserRepository {
    register(user: User): Promise<void>;
    findAll(): Promise<User[]>;
    delete(userId: string): Promise<void>;
}