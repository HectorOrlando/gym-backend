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
    async getAllUsers() {
        const users = await this.findAllUsers.run();  // Ejecuta la función 'run' del caso de uso FindAllUsers para obtener todos los usuarios
        return users; // Retorna la lista de usuarios directamente
    }

    async getUserById(id: string) {
        const user = await this.findUserById.run(id);
        return user;
    }

    async insertUser(req: Request) {
        const userData = req.body;
        await this.createUser.run(userData);
    }
}
