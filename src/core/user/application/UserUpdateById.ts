import { User } from "../domain/User";
import { UserRepository } from "../domain/UserRepository";

export class UserUpdateById {
    public constructor(private readonly repository: UserRepository) {
        this.repository = repository;
    }

    public async run(userId: string, name: string, email: string, password: string): Promise<void> {
        await this.repository.update(userId, name, email, password);
    }
}