Tengo los siguientes archivos:

// src\core\shared\domain\ObjectId.ts

import { ObjectId as MongoObjectID } from 'mongodb';

// Esto podría ser una clase abstracta
export class ObjectId {
    public readonly value: string;

    public constructor(id: string) {
        this.checkIsValid(id);
        this.value = new MongoObjectID(id).toHexString();
    }

    public static random(): ObjectId {
        const id = new MongoObjectID().toHexString();

        return new ObjectId(id);
    }

    protected checkIsValid(value: string): void {
        if(!MongoObjectID.isValid(value)) {
            throw new Error(`Id is not valid. ${value}`);
        }
    }
}

// src\core\shared\infrastructure\mongodb\connections\Connection.ts

import { MongoClient, Db } from "mongodb";
import dotenv from "dotenv";
dotenv.config();    // Carga las variables de entorno desde .env

// Función para establecer una conexión con la base de datos
export const dbConnection = async (): Promise<Db> => {
    // Obtiene la cadena de conexión a la base de datos desde las variables de entorno
    const mongodbCnn = process.env.MONGODB_CNN;
    // Verifica si la cadena de conexión está definida
    if (!mongodbCnn) {
        throw new Error("MONGODB_CNN environment variable is not defined");
    }

    try {
        // Crea una instancia del cliente de MongoDB usando la cadena de conexión
        const client = new MongoClient(mongodbCnn);
        // Conecta al cliente con el servidor de MongoDB
        await client.connect();
        // Obtiene una instancia de la base de datos
        const db = client.db();
        // Retorna la instancia de la base de datos
        return db;
    } catch (error) {
        throw new Error("Error when starting the database");
    }
};


/********* USER  *********/

// src\core\user\application\index.ts

export * from './UserFindAll';
export * from './UserRegister';
export * from './UserDelete';
export * from './UserFindById';
export * from './UserUpdateById';


// src\core\user\application\UserDelete.ts

import { User } from "../domain/User";
import { UserId } from "../domain/UserId";
import { UserRepository } from "../domain/UserRepository";

export class UserDelete {
    public constructor(private readonly repository: UserRepository) {
        this.repository = repository;
    }

    public async run(id: string): Promise<void> {
        // const user: User = await this.repository.find(new UserId(id));

        // user.delete();

        await this.repository.delete(id);
    }
}

// src\core\user\application\UserFindAll.ts

import { UserRepository } from "../domain/UserRepository";
import { User } from "../domain/User";

export class UserFindAll {
    public constructor(private readonly repository: UserRepository) {
        this.repository = repository;
    }

    public async run(): Promise<User[]> {
        return await this.repository.findAll();
    }
}

import { User } from "../domain/User";
import { UserRepository } from "../domain/UserRepository";

export class UserFindById {
    public constructor(private readonly repository: UserRepository) {
        this.repository = repository;
    }

    public async run(id: string): Promise<User> {
        return await this.repository.findById(id);
    }
}

// src\core\user\application\UserRegister.ts

// Importa las clases y tipos necesarios del dominio de usuario
import { User } from "../domain/User";
import { UserRepository } from "../domain/UserRepository";

// Define un tipo para la solicitud de registro de usuario
type Request = {
    name: string;
    email: string;
    password: string;
}

// Clase que representa el caso de uso de registro de usuario
export class UserRegister {
    // Constructor que recibe una instancia de UserRepository a través de la inyección de dependencias
    public constructor(private readonly repository: UserRepository) {
        this.repository = repository;
    }

    // Método que ejecuta el caso de uso de registro de usuario
    public async run(request: Request): Promise<void> {
        // Crea un nuevo usuario utilizando el método estático de la clase User register()
        const user = User.register(request.name, request.email, request.password);

        // Llama al método de registro en el repositorio de usuario, almacenando el usuario en el sistema
        await this.repository.register(user);
    }
}

import { User } from "../domain/User";
import { UserRepository } from "../domain/UserRepository";

export class UserUpdateById {
    public constructor(private readonly repository: UserRepository) {
        this.repository = repository;
    }

    public async run(userId: string, name: string, email: string, password: string): Promise<void> {
        await this.repository.update(userId, name, email, password);
    }
}

// src\core\user\domain\User.ts

import { UserId } from "./UserId";

// Definición de la clase User
export class User {
    // Propiedades privadas
    private readonly _id: UserId;
    private _name: string;
    private _email: string;
    private _password: string;
    private readonly _createdAt: Date;
    private _updatedAt: Date | undefined;
    private _isDeleted: boolean;
    
    // Constructor public
    public constructor(
        id: UserId,
        name: string,
        email: string,
        password: string,
        createdAt: Date,
        updatedAt: Date | undefined,
        isDeleted: boolean,
    ) {
        // Inicialización de propiedades
        this._id = id;
        this._name = this.validateName(name);
        this._email = this.validateEmail(email);
        this._password = this.validatePassword(password);
        this._createdAt = createdAt;
        this._updatedAt = updatedAt;
        this._isDeleted = isDeleted;
    }

    // Métodos de obtención (getters) para acceder a propiedades privadas
    public get id(): UserId {
        return this._id;
    }

    public get name(): string {
        return this._name;
    }

    public get email(): string {
        return this._email;
    }

    public get password(): string {
        return this._password;
    }

    public get createdAt(): Date {
        return this._createdAt;
    }

    public get updatedAt(): Date | undefined {
        return this._updatedAt;
    }

    public get isDeleted(): boolean {
        return this._isDeleted;
    }

    // Método para marcar el usuario como eliminado
    public delete(): void {
        this._isDeleted = true;
        this.updateUpdatedAt();
    }

    // Métodos para actualizar el nombre, correo electrónico y contraseña del usuario
    public updateName(name: string): void {
        this._name = this.validateName(name);
        this.updateUpdatedAt();
    }

    public updateEmail(email: string): void {
        this._email = this.validateEmail(email);
        this.updateUpdatedAt();
    }

    public updatePassword(password: string): void {
        this._password = this.validatePassword(password);
        this.updateUpdatedAt();
    }

    // Método privado para actualizar la fecha de última modificación
    private updateUpdatedAt(): void {
        this._updatedAt = new Date();
    }

    // Método para obtener el valor del ID como cadena
    public getIdValue(): string {
        return this._id.value;
    }

    // Métodos de validación para nombre, correo electrónico y contraseña
    private validateName(name: string): string {
        if (!name || name.trim().length < 2) {
            throw new Error("El nombre debe tener al menos dos caracteres.");
        }
        return name.trim();
    }

    private validateEmail(email: string): string {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new Error("El formato del correo electrónico no es válido.");
        }
        return email.trim();
    }

    private validatePassword(password: string): string {
        if (password.length < 8) {
            throw new Error("La contraseña debe tener al menos 8 caracteres.");
        }
        return password;
    }

    // Método estático de la fábrica para registrar un nuevo usuario
    public static register(name: string, email: string, password: string): User {
        const id = UserId.random();
        const createdAt = new Date();
        const updateAt = undefined;
        const isDeleted = false;
        return new User(id, name, email, password, createdAt, updateAt, isDeleted);
    }
}

// src\core\user\domain\UserId.ts

import { ObjectId } from "../../shared/domain/ObjectId";

export class UserId extends ObjectId {
    public static random(): UserId {
        return new UserId(super.random().value);
    }
}

// src\core\user\domain\UserRepository.ts

import { User } from "./User";

export interface UserRepository {
    register(user: User): Promise<void>;
    delete(userId: string): Promise<void>;
    findAll(): Promise<User[]>;
    findById(userId: string): Promise<User>;
    update(userId: string, name: string, email: string, password: string): Promise<void>;
}

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

    async delete(userId: string): Promise<void> {
        try {
            const _id = new ObjectId(userId);
            const user = await this.collection.findOne(_id);
            if (!user) {
                throw new Error('El id de usuario no existe');
            }

            const userInstance = new User(
                new UserId(user._id.toHexString()),
                user.name,
                user.email,
                user.password,
                user.createdAt,
                user.updatedAt,
                user.isDeleted
            );

            userInstance.delete();

            await this.collection.updateOne(
                { _id },
                {
                    $set: {
                        isDeleted: userInstance.isDeleted,
                        updatedAt: userInstance.updatedAt,
                    }
                }
            );

        } catch (error) {
            throw new Error("Error al borrar el usuario.");
        }
    }

    async findById(userId: string): Promise<User> {
        try {
            const _id = new ObjectId(userId);
            const user = await this.collection.findOne({ _id });
            if (!user) {
                throw new Error('El id de usuario no existe.');
            }

            return new User(
                new UserId(user._id.toHexString()),
                user.name,
                user.email,
                user.password,
                user.createdAt,
                user.updatedAt,
                user.isDeleted
            );

        } catch (error) {
            throw new Error("Error al buscar el usuario por id.");
        }
    }

    async update(userId: string, name: string, email: string, password: string): Promise<void> {
        try {
            const _id = new ObjectId(userId);
            const user = await this.collection.findOne({ _id });

            if (!user) {
                throw new Error('El id de usuario no existe.');
            }

            const updatedUser: User = new User(
                new UserId(user._id.toHexString()),
                name || user.name, // Si name es null o undefined, mantiene el valor existente
                email || user.email, // Si email es null o undefined, mantiene el valor existente
                password || user.password,
                user.createdAt,
                new Date(), // Actualiza updatedAt con la fecha actual
                user.isDeleted
            );

            await this.collection.updateOne(
                { _id },
                {
                    $set: {
                        name: updatedUser.name,
                        email: updatedUser.email,
                        password: updatedUser.password,
                        updatedAt: updatedUser.updatedAt,
                    }
                }
            );

        } catch (error) {
            throw new Error("Error al actualizar el usuario por id.");
        }
    }
}

// src\core\user\infrastructure\UserController.ts

import { WithId, Document } from "mongodb";
import { UserDelete, UserRegister, UserFindAll, UserFindById, UserUpdateById } from "../application";
import { User } from "../domain/User";


type RegisterUserRequest = {
    name: string;
    email: string;
    password: string;
}

type UserResponse = {
    id: string;
    name: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date | undefined;
    isDeleted: boolean;
}

// Clase que representa el controlador de usuarios
export class UserController {
    // Constructor que recibe una instancia de FindAllUsers como parámetro
    constructor(
        public register: UserRegister,
        public deleteUser: UserDelete,
        public findAll: UserFindAll,
        public findById: UserFindById,
        public update: UserUpdateById
    ) { }

    async registerUser(request: RegisterUserRequest): Promise<void> {
        const user = { name: request.name, email: request.email, password: request.password }
        await this.register.run(user);
    }

    async userDelete(id: string): Promise<void> {
        await this.deleteUser.run(id);
    }

    async findAllUsers(): Promise<UserResponse[]> {
        const users = await this.findAll.run();

        return users.map(user => {
            return {
                id: user.id.value,
                name: user.name,
                email: user.email,
                password: user.password,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
                isDeleted: user.isDeleted,
            }
        })
    }

    async findByIdUser(id: string): Promise<UserResponse> {
        const user = await this.findById.run(id);

        return {
            id: user.id.value,
            name: user.name,
            email: user.email,
            password: user.password,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            isDeleted: user.isDeleted,
        }
    }

    async updateByIdUser(userId: string, name: string, email: string, password: string): Promise<void> {
        await this.update.run(userId, name, email, password);
    }
}


// src\core\user\infrastructure\userDependencies.ts

import { UserController } from './UserController';
import { MongoUserRepository } from "./MongoUserRepository";

import {  UserRegister, UserFindAll, UserFindById, UserDelete, UserUpdateById } from '../application';

// Creamos una instancia de MongoUserRepository, que es una implementación de UserRepository.
const userRepository = new MongoUserRepository();

// Inversión de dependencias: Pasamos la instancia de userRepository como argumento en la creación de instancias de los casos de uso.
export const userRegister = new UserRegister(userRepository);
export const userDelete = new UserDelete(userRepository);
export const userFindAll = new UserFindAll(userRepository);
export const userFindById = new UserFindById(userRepository);
export const updateUserById = new UserUpdateById(userRepository);


// Inyección de dependencias: Pasamos las instancias de los casos de uso como argumentos en la creación de la instancia de UserContoller.
export const userController = new UserController(
    userRegister,
    userDelete,
    userFindAll,
    userFindById,
    updateUserById
);





