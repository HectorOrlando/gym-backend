// src\core\user\infrastructure\userDependencies.ts

import { UserController } from './UserController';
import { MongoUserRepository } from "./MongoUserRepository";

import { UserDelete, UserRegister, UserShow } from '../application';

// Creamos una instancia de MongoUserRepository, que es una implementación de UserRepository.
const userRepository = new MongoUserRepository();

// Inversión de dependencias: Pasamos la instancia de userRepository como argumento en la creación de instancias de los casos de uso.
export const userRegister = new UserRegister(userRepository);
export const userShow = new UserShow(userRepository);
export const userDelete = new UserDelete(userRepository);

// Inyección de dependencias: Pasamos las instancias de los casos de uso como argumentos en la creación de la instancia de UserContoller.
export const userController = new UserController(
    userRegister,
    userShow,
    userDelete
);