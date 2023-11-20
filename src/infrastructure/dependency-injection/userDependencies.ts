// userDependencies.ts

import { UserController } from "../controllers/UserController";
import { MongoUserRepository } from "../repositories/MongoUserRepository";
import { FindAllUsers } from "../../application/user-use-cases/FindAllUsers";

// Investigar como funciona un contenedor de dependencias como TypeDi, Inversify, etc.

// Creación de instancias y configuración de inyección de dependencias.

// Creamos una instancia de MongoUserRepository, que es una implementación de UserRepository.
const userRepository = new MongoUserRepository();

// Inversión de dependencias: Pasamos la instancia de userRepository como argumento en la creación de instancias de los casos de uso.
export const findAllUsers = new FindAllUsers(userRepository);

// Inyección de dependencias: Pasamos las instancias de los casos de uso como argumentos en la creación de la instancia de UserContoller.
export const userController = new UserController(
    findAllUsers
);