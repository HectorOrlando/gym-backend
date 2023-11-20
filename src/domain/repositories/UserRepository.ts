// UserRepository.ts

import { WithId, Document } from "mongodb";

// Interfaz que define los métodos que debe implementar un repositorio de usuarios.
export interface UserRepository {
    findAllUsers(): Promise<WithId<Document>[]>;
    findUserById(id: string): Promise<WithId<Document>>;
}