// src\core\user\domain\UserRepository.ts

import { User } from "./User";

export interface UserRepository {
    register(user: User): Promise<void>;
    delete(userId: string): Promise<void>;
    findAll(): Promise<User[]>;
    findById(userId: string): Promise<User>;
}