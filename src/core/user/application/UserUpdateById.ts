import { User } from "../domain/User";
import { UserRepository } from "../domain/UserRepository";

export class UserUpdateById {
    public constructor(private readonly repository: UserRepository) {}

    public async run(userId: string, name: string, email: string, password: string): Promise<void> {
        // @ts-ignore
        await this.repository.update(userId, name, email, password);
    }
}