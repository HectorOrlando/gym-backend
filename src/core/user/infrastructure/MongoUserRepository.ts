// src\core\user\infrastructure\MongoUserRepository.ts

// Importa las interfaces y tipos necesarios de MongoDB y la función de conexión a la base de datos
import { Collection, WithId, Document, ObjectId } from "mongodb";
import { dbConnection } from "../../shared/infrastructure/mongodb/connections/Connection";

import { User } from "../domain/User";
import { UserRepository } from "../domain/UserRepository";
import { UserId } from "../domain/UserId";

// Clase que implementa la interfaz UserRepository y se conecta a MongoDB
export class MongoUserRepository implements UserRepository {
    // Propiedad privada que representa la colección de usuarios en la base de datos
    private collection?: Collection;

    constructor() { this.connect(); }

    //  Establece la conexión con la base de datos.
    private async connect(): Promise<void> {
        const db = await dbConnection();
        this.collection = db.collection('users');
        if (!this.collection) {
            throw new Error('The connection to the users Collection of the database is not established');
        }
    }

    async register(user: User): Promise<void> {
        try {
            const userToRegister = {
                _id: new ObjectId(user.getIdValue()),
                name: user.getName(),
                email: user.getEmail(),
            };
            await this.collection!.insertOne(userToRegister);
        } catch (error) {
            throw new Error("Error insert user.");
        }
    }

    async show(): Promise<WithId<Document>[]> {
        try {
            return await this.collection!.find().toArray();
        } catch (error: any) {
            throw new Error("Error show users list");
        }
    }

    async delete(id: string): Promise<void> {
        try {
            const filter = { _id: new ObjectId(id) };
            await this.collection!.deleteOne(filter);
        } catch (error) {
            throw new Error("Error delete users list");
        }
    }


}