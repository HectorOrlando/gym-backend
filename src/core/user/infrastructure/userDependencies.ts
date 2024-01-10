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