// src\core\user\infrastructure\MongoUserRepository.ts

// Importa las interfaces y tipos necesarios de MongoDB y la función de conexión a la base de datos
import { Collection, WithId, Document, ObjectId } from "mongodb";
import { dbConnection } from "../../shared/infrastructure/mongodb/connections/Connection";

import { User } from "../domain/User";
import { UserRepository } from "../domain/UserRepository";
import { UserId } from "../domain/UserId";

// Define un tipo que representa la estructura de los datos almacenados en MongoDB para un usuario
type UserPrimitives = {
    _id: ObjectId;
    name: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date | undefined;
    isDeleted: boolean;
};

// Clase que implementa la interfaz UserRepository y se conecta a MongoDB
export class MongoUserRepository implements UserRepository {
    // Propiedad privada que representa la colección de usuarios en la base de datos
    private collection!: Collection<UserPrimitives>;
    // Constructor que establece la conexión con la base de datos al instanciar la clase
    constructor() { this.connect(); }

    //  Establece la conexión con la base de datos.
    private async connect(): Promise<void> {
        const db = await dbConnection();
        this.collection = db.collection('users');
        if (!this.collection) {
            throw new Error('The connection to the users Collection of the database is not established');
        }
    }

    // Implementación del método de registro de un usuario en la base de datos MongoDB
    async register(user: User): Promise<void> {
        try {
            // Convierte los datos del usuario de dominio a la estructura de datos de MongoDB
            const userToRegister = {
                _id: new ObjectId(user.getIdValue()),   // Se asigna un nuevo ObjectId basado en el ID del usuario de dominio
                name: user.name,
                email: user.email,
                password: user.password,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
                isDeleted: user.isDeleted,
            };
            // Inserta el usuario en la colección de MongoDB
            await this.collection!.insertOne(userToRegister);
        } catch (error) {
            throw new Error("Error insert user.");
        }
    }

    async findAll(): Promise<User[]> {
        try {
            const usersFound = await this.collection.find().toArray();
            
            return usersFound.map(user => {
                console.log(user);
                return new User(
                    new UserId(user._id.toHexString()),
                    user.name,
                    user.email,
                    user.password,
                    user.createdAt,
                    user.updatedAt,
                    user.isDeleted
                )
            });

        } catch (error) {
            throw new Error("Error findAll users list");
        }
    }

}


    // async show(): Promise<User[]> {
    //     try {
    //         // Aquí viene los datos de la DB
    //         const usersFound = await this.collection.find().toArray();

    //         // Aquí mapeamos los datos que vienen de mongo a nuestro User de dominio
    //         return usersFound.map(user => {
    //             return new User(
    //                 new UserId(user._id.toHexString()),
    //                 user.name,
    //                 user.email
    //             )
    //         })

    //     } catch (error: any) {
    //         throw new Error("Error show users list");
    //     }
    // }

    // async delete(user: User): Promise<void> {
    //     try {
    //         const filter = { _id: new ObjectId(user.id.value) };
    //         await this.collection!.updateOne(filter, {
    //             $set: {
    //                 deletedAt: user.deletedAt
    //             }
    //         });
    //     } catch (error) {
    //         throw new Error("Error delete users list");
    //     }
    // }