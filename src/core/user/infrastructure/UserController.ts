// src\core\user\infrastructure\UserController.ts

import { WithId, Document } from "mongodb";
import { UserDelete, UserRegister, UserShow } from "../application";


type RegisterUserRequest = {
    name: string;
    email: string;
}

// Clase que representa el controlador de usuarios
export class UserController {
    // Constructor que recibe una instancia de FindAllUsers como parámetro
    constructor(
        public register: UserRegister,
        public show: UserShow,
        public deleteUser: UserDelete,
    ) { }

    async registerUser(request: RegisterUserRequest): Promise<void> {
        const userData = { name: request.name, email: request.email }
        await this.register.run(userData);
    }

    async showUser(): Promise<WithId<Document>[]> {
        return await this.show.run();
    }

    async userDelete(id: string): Promise<void> {
        await this.deleteUser.run(id);
    }

}
