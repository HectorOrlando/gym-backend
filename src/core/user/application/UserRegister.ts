// src\core\user\application\UserRegister.ts

// Importa las clases y tipos necesarios del dominio de usuario
import { User } from '../domain/User';
import { UserEmail } from '../domain/UserEmail';
import { UserRepository } from '../domain/UserRepository';

// Define un tipo para la solicitud de registro de usuario
type Request = {
  name: string;
  email: string;
  password: string;
};

// Clase que representa el caso de uso de registro de usuario
export class UserRegister {
  public constructor(private readonly repository: UserRepository) {} // Constructor que recibe una instancia de UserRepository a través de la inyección de dependencias

  public async run(request: Request): Promise<void> {
    // Método que ejecuta el caso de uso de registro de usuario
    const user = User.register(
      request.name,
      new UserEmail(request.email),
      request.password,
    ); // Crea un nuevo usuario utilizando el método estático de la clase User register()
    await this.repository.register(user); // Llama al método de registro en el repositorio de usuario, almacenando el usuario en el sistema
  }
}
