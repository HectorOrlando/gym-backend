// userDependencies.ts

import { UserController } from '../controllers/UserController';
import { MongoUserRepository } from '../repositories/MongoUserRepository';

import {
  FindAllUsers,
  FindUserById,
  CreateUser,
  UpdateUserById,
  DeleteUserById,
} from '../../application/user-use-cases';

// Creamos una instancia de MongoUserRepository, que es una implementación de UserRepository.
const userRepository = new MongoUserRepository();

// Inversión de dependencias: Pasamos la instancia de userRepository como argumento en la creación de instancias de los casos de uso.
export const findAllUsers = new FindAllUsers(userRepository);
export const findUserById = new FindUserById(userRepository);
export const createUser = new CreateUser(userRepository);
export const updateUserById = new UpdateUserById(userRepository);
export const deleteUserById = new DeleteUserById(userRepository);

// Inyección de dependencias: Pasamos las instancias de los casos de uso como argumentos en la creación de la instancia de UserContoller.
export const userController = new UserController(
  findAllUsers,
  findUserById,
  createUser,
  updateUserById,
  deleteUserById,
);
