// src\core\user\domain\UserRepository.ts

import { User } from "./User";

export interface UserRepository {
    register(user: User): Promise<void>;
    // show(): Promise<User[]>;
    // delete(user: User): Promise<void>;
}

// Dominio no tiene que saber de infraestructura nada de MongoDB. idMongo, documento de Mongo