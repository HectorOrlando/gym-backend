// src\core\user\application\UserDelete.ts

// Importación de las clases y tipos necesarios desde el dominio
import { User } from "../domain/User";
import { UserId } from "../domain/UserId";
import { UserRepository } from "../domain/UserRepository";

// Definición de la clase UserDelete que maneja la lógica de eliminación de usuarios
export class UserDelete {
    // Constructor que recibe una instancia de UserRepository para acceder a los usuarios en el dominio
    public constructor(private readonly repository: UserRepository) { }

    // Método asincrónico que realiza la eliminación de un usuario por su ID
    public async run(id: string): Promise<void> {
        // Obtener un usuario por su ID utilizando el UserRepository
        const user: User = await this.repository.findById(new UserId(id));
        // Llamar al método 'delete' del User para marcar el usuario como eliminado
        user.delete();

        // Llamar al método 'delete' del UserRepository para eliminar físicamente el usuario
        await this.repository.delete(user);
    }
}
