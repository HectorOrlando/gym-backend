import { User } from "../domain/User";
import { UserEmail } from "../domain/UserEmail";
import { UserId } from "../domain/UserId";
import { UserRepository } from "../domain/UserRepository";

// Define un tipo para la solicitud de actualización de usuario por ID
type Request = {
    name: string;
    email: string;
    password: string;
}

export class UserUpdateById {
    public constructor(private readonly repository: UserRepository) { }

    public async run(id: string, request: Request): Promise<void> {
        const user: User = await this.repository.findById(new UserId(id));
        user.updateName(request.name);
        user.updateEmail(new UserEmail(request.email));
        user.updatePassword(request.password);
        await this.repository.update(user);
    }
}                        