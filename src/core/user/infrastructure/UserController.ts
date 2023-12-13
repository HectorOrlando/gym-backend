// src\core\user\infrastructure\UserController.ts

import { WithId, Document } from "mongodb";
import { UserDelete, UserRegister, UserShow } from "../application";
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
        const user = { name: request.name, email: request.email, password: request.password }
        await this.register.run(user);
    }

    // async showUser(): Promise<UserResponse[]> {
    //     const users =  await this.show.run();

    //     return users.map(user => {
    //         return {
    //             id: user.id.value,
    //             name: user.name,
    //             email: user.email
    //         }
    //     })
    // }

    async userDelete(id: string): Promise<void> {
        await this.deleteUser.run(id);
    }

}
