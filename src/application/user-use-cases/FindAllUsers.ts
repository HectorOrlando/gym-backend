// FindAllUsers.ts

import { UserRepository } from '../../domain/repositories/UserRepository';

// Clase que representa un caso de uso para encontrar todos los usuarios
export class FindAllUsers {
    // Inyección de dependencias: la dependencia UserRepository se inyecta a través del constructor.
    constructor(private userRepository: UserRepository) {
        this.userRepository = userRepository;   // Asigna la instancia de UserRepository a la propiedad privada userRepository
    }

    async run() {
        // Retorna la lista de usuarios encontrados.
        return await this.userRepository.findAllUsers();
    }
}