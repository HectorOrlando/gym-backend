// UserRepository.ts

import { WithId, Document } from "mongodb";
import { UserModel } from '../models/UserModel';

// Interfaz que define los métodos que debe implementar un repositorio de usuarios.
export interface UserRepository {
    findAllUsers(): Promise<WithId<Document>[]>;
    findUserById(id: string): Promise<WithId<Document>>;
    createUser(user: UserModel): Promise<void>;
}

// MongoUserRepository.ts

// Importa las interfaces y tipos necesarios de MongoDB y la función de conexión a la base de datos
import { Collection, WithId, Document, ObjectId } from "mongodb";
import { dbConnection } from "../mongodb/connections/Connection";

// Importaciones desde el dominio
import { UserModel } from "../../domain/models/UserModel";
import { UserRepository } from "../../domain/repositories/UserRepository";

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

    // Obtiene todos los usuarios de la base de datos.
    async findAllUsers(): Promise<WithId<Document>[]> {
        try {
            const userDocs = await this.collection!.find().toArray();
            return userDocs;
        } catch (error: any) {
            throw new Error("Error getting users list");
        }
    }

    async findUserById(id: string): Promise<WithId<Document>> {
        try {
            const idUser = { _id: new ObjectId(id) }
            const userDoc = await this.collection!.findOne(idUser);
            return userDoc!;
        } catch (error) {
            throw new Error("Error gettin user.");
        }
    }

    async createUser(user: UserModel): Promise<void> {
        try {
            await this.collection!.insertOne(user);
        } catch (error) {
            throw new Error("Error insert user.");
        }
    }
}


import { UserRepository } from "../../domain/repositories/UserRepository";
import { UserModel } from '../../domain/models/UserModel';

type userType = {
    name: string;
    email: string;
}

export class CreateUser {
    constructor(private userRepository: UserRepository) {
        this.userRepository = userRepository;
    }

    async run(userType: UserModel) {
        await this.userRepository.createUser(userType);
    }
}

// UserController.ts

import { Request } from "express";

import { FindAllUsers, FindUserById, CreateUser } from "../../application/user-use-cases";

// Clase que representa el controlador de usuarios
export class UserController {
    // Constructor que recibe una instancia de FindAllUsers como parámetro
    constructor(
        public findAllUsers: FindAllUsers,
        public findUserById: FindUserById,
        public createUser: CreateUser
    ) { }

    // Controlador para obtener todos los usuarios.
    getAllUsers() {
        const users = this.findAllUsers.run();  // Ejecuta la función 'run' del caso de uso FindAllUsers para obtener todos los usuarios
        return users; // Retorna la lista de usuarios directamente
    }

    getUserById(id: string) {
        const user = this.findUserById.run(id);
        return user;
    }

    insertUser(req: Request) {
        const userData = req.body;
        this.createUser.run(userData);
    }
}


// userDependencies.ts

import { UserController } from "../controllers/UserController";
import { MongoUserRepository } from "../repositories/MongoUserRepository";

import { FindAllUsers, FindUserById, CreateUser } from "../../application/user-use-cases";


// Creamos una instancia de MongoUserRepository, que es una implementación de UserRepository.
const userRepository = new MongoUserRepository();

// Inversión de dependencias: Pasamos la instancia de userRepository como argumento en la creación de instancias de los casos de uso.
export const findAllUsers = new FindAllUsers(userRepository);
export const findUserById = new FindUserById(userRepository);
export const createUser = new CreateUser(userRepository);

// Inyección de dependencias: Pasamos las instancias de los casos de uso como argumentos en la creación de la instancia de UserContoller.
export const userController = new UserController(
    findAllUsers,
    findUserById,
    createUser
);

// userRouter.ts

import express, { NextFunction, Request, Response } from "express";

import { userController } from '../dependency-injection/userDependencies';

import { ErrorHandler } from "../error/ErrorHandler";
import { userValidationMiddleware } from "../middlewares/userMiddlewares";

// Creamos el enrutador para la entidad 'usuarios'
export const userRouter = express.Router();

// Definir la ruta GET /users en el enrutador userRouter
userRouter.get("/users", async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Obtenemos todos los usuarios desde el controlador usando el caso de uso getAllUsers
        const users = await userController.getAllUsers();
        return res.json({ users });
    } catch (error) {
        ErrorHandler.handleError(error, req, res, next);
    }
});

userRouter.get("/users/:id", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await userController.getUserById(req.params.id);
        return res.json({ user });
    } catch (error) {
        ErrorHandler.handleError(error, req, res, next);
    }
});

userRouter.post("/user", userValidationMiddleware, async (req: Request, res: Response, next: NextFunction) => {
    try {
        await userController.insertUser(req);
        res.status(201).send('User create successfully').end();
    } catch (error) {
        ErrorHandler.handleError(error, req, res, next);
    }
});

// TODO: MIRARA EL AVISO Del await ...
