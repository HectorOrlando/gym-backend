// src\core\user\domain\UserRepository.ts

import { User } from "./User";
import { UserId } from "./UserId";

/******* NO MODIFICAR  *********/
export interface UserRepository {
    register(user: User): Promise<void>;
    delete(user: User): Promise<void>;
    findAll(): Promise<User[]>;
    findById(userId: UserId): Promise<User>;
    update(user: User): Promise<void>;
}