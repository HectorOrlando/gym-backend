import { User } from "../domain/User";
import { UserRepository } from "../domain/UserRepository";

export class UserFindById {
    public constructor(private readonly repository: UserRepository) {
        this.repository = repository;
    }

    public async run(id: string): Promise<User> {
        return await this.repository.findById(id);
    }
}
