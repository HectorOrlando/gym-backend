import { UserEmail } from "../domain/UserEmail";
import { UserId } from "../domain/UserId";
import { UserRepository } from "../domain/UserRepository";

export class UserUpdateEmail {
    public constructor(private readonly repository: UserRepository) { }

    async run(id: string, email: string) {
        const user = await this.repository.findById(new UserId(id));
        user.updateEmail(new UserEmail(email)); // Validar que el nuevo email sea diferente.
        this.repository.update(user);
    }
}