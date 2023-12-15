import { UserEmail } from "../domain/UserEmail";
import { UserId } from "../domain/UserId";
import { UserRepository } from "../domain/UserRepository";


export class UserUpdateEmail {
    public constructor(private readonly repository: UserRepository) {}

    async run(id: string, email: string) {
        const user = await this.repository.findById(new UserId(id));

        // Validar que el nuevo email sea diferente.
        user.updateEmail(new UserEmail(email));

        this.repository.update(user);
    }
}