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

// src\core\user\domain\User.ts

import { ObjectId } from "../../shared/domain/ObjectId";
import { UserId } from "./UserId";

export class User {
    private readonly id: UserId;
    private name: string;
    private email: string;

    public constructor(
        id: UserId,
        name: string,
        email: string
    ) {
        this.id = id;
        this.name = name;
        this.email = email;
    }

    public static register(name: string, email: string): User {
        return new User(
            UserId.random(),
            name,
            email
        );
    }

    // Método público para obtener el valor de 'id'
    public getIdValue(): string {
        return this.id.value;
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
import { WithId, Document } from "mongodb";
import { User } from "./User";

export interface UserRepository {
    register(user: User): Promise<void>;
    show(): Promise<WithId<Document>[]>;
}

// src\core\user\application\index.ts

export * from './UserShow';
export * from './UserRegister';


// src\core\user\application\UserRegister.ts

import { User } from "../domain/User";
import { UserRepository } from "../domain/UserRepository";

type Request = {
    name: string;
    email: string;
}

export class UserRegister {
    public constructor(private readonly repository: UserRepository){
        this.repository = repository;
    }

    public async run(request: Request): Promise<void> {
        const user = User.register(request.name, request.email);
        await this.repository.register(user);
    }
}

// src\core\user\application\UserShow.ts

import { WithId, Document } from "mongodb";

import { UserRepository } from "../domain/UserRepository";

export class UserShow {
    public constructor(private readonly repository: UserRepository) {
        this.repository = repository;
    }

    public async run(): Promise<WithId<Document>[]> {
        return await this.repository.show();
    }
}



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
            await this.collection!.insertOne(user);
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

}

// src\core\user\infrastructure\UserController.ts

import { Request } from "express";
import { WithId, Document } from "mongodb";
import { UserRegister, UserShow } from "../application";

type RegisterUserRequest = {
    name: string;
    email: string;
}

// Clase que representa el controlador de usuarios
export class UserController {
    // Constructor que recibe una instancia de FindAllUsers como parámetro
    constructor(
        public register: UserRegister,
        public show: UserShow
    ) { }

    async registerUser(request: RegisterUserRequest): Promise<void> {
        const userData = { name: request.name, email: request.email }
        await this.register.run(userData);
    }

    async showUser(): Promise<WithId<Document>[]> {
        return await this.show.run();
    }

}

// src\core\user\infrastructure\userDependencies.ts

import { UserController } from './UserController';
import { MongoUserRepository } from "./MongoUserRepository";

import { UserRegister, UserShow } from '../application';

// Creamos una instancia de MongoUserRepository, que es una implementación de UserRepository.
const userRepository = new MongoUserRepository();

// Inversión de dependencias: Pasamos la instancia de userRepository como argumento en la creación de instancias de los casos de uso.
export const userRegister = new UserRegister(userRepository);
export const userShow = new UserShow(userRepository);

// Inyección de dependencias: Pasamos las instancias de los casos de uso como argumentos en la creación de la instancia de UserContoller.
export const userController = new UserController(
    userRegister,
    userShow
);


// src\infrastructure\routes\userRoutes.ts

import express, { NextFunction, Request, Response } from "express";
import { userController } from "../../core/user/infrastructure/userDependencies";
// import { userController } from '../dependency-injection/userDependencies';

import { ErrorHandler } from "../error/ErrorHandler";
import { userValidationMiddleware } from "../middlewares/userMiddlewares";




// Creamos el enrutador para la entidad 'usuarios'
export const userRouter = express.Router();


type RegisterUserRequest = {
    name: string;
    email: string;
}


// Definir la ruta GET /users en el enrutador userRouter
// userRouter.get("/users", async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         // Obtenemos todos los usuarios desde el controlador usando el caso de uso getAllUsers
//         const users = await userController.getAllUsers();
//         return res.json({ users });
//     } catch (error) {
//         ErrorHandler.handleError(error, req, res, next);
//     }
// });

// userRouter.get("/users/:id", async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const user = await userController.getUserById(req.params.id);
//         return res.json({ user });
//     } catch (error) {
//         ErrorHandler.handleError(error, req, res, next);
//     }
// });

// Definir la ruta GET /users en el enrutador userRouter
userRouter.get("/users", async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Obtenemos todos los usuarios desde el controlador usando el caso de uso getAllUsers
        const users = await userController.showUser();
        return res.json({ users });
    } catch (error) {
        ErrorHandler.handleError(error, req, res, next);
    }
});

userRouter.post("/user", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const body: RegisterUserRequest = req.body;
        const { name, email } = body;
        const userData = { name, email } 
        await userController.registerUser(userData);
        res.status(201).send('User create successfully').end();
    } catch (error) {
        ErrorHandler.handleError(error, req, res, next);
    }
});

// userRouter.post("/user", userValidationMiddleware, async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         await userController.insertUser(req);
//         res.status(201).send('User create successfully').end();
//     } catch (error) {
//         ErrorHandler.handleError(error, req, res, next);
//     }
// });

// userRouter.put("/user/:id", userValidationMiddleware, async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         await userController.putUserById(req);
//         res.status(204).header('X-Message', 'User update successfully').end();
//     } catch (error) {
//         ErrorHandler.handleError(error, req, res, next);
//     }
// });

// userRouter.delete("/user/:id", async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         await userController.removeUserById(req.params.id);
//         res.status(204).header('X-Message', 'User deleted successfully').end();
//     } catch (error) {
//         ErrorHandler.handleError(error, req, res, next);
//     }
// });