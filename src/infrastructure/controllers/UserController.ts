// UserController.ts

import { FindAllUsers } from "../../application/user-use-cases/FindAllUsers";

// Clase que representa el controlador de usuarios
export class UserController {
    // Constructor que recibe una instancia de FindAllUsers como parámetro
    constructor(
        public findAllUsers: FindAllUsers
    ) { }

    // Controlador para obtener todos los usuarios.
    getAllUsers() {
        const users = this.findAllUsers.run();  // Ejecuta la función 'run' del caso de uso FindAllUsers para obtener todos los usuarios
        return users; // Retorna la lista de usuarios directamente
    }
}
