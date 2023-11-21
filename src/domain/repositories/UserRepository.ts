// UserRepository.ts

import { WithId, Document } from "mongodb";
import { UserModel } from '../models/UserModel';

// Interfaz que define los métodos que debe implementar un repositorio de usuarios.
export interface UserRepository {
    findAllUsers(): Promise<WithId<Document>[]>;
    findUserById(id: string): Promise<WithId<Document>>;
    createUser(user: UserModel): Promise<void>;
    updateUserById(id: string, user: UserModel): Promise<void>;
    deleteUserById(id: string): Promise<void>;
}