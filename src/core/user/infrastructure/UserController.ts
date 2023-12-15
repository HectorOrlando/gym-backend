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
                email: user.email.value,
                password: user.password.value,
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
            email: user.email.value,
            password: user.password.value,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            isDeleted: user.isDeleted,
        }
    }

    async updateByIdUser(userId: string, name: string, email: string, password: string): Promise<void> {
        await this.update.run(userId, name, email, password);
    }
}
