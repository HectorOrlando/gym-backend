import { User } from "../domain/User";
import { UserId } from "../domain/UserId";
import { UserRepository } from "../domain/UserRepository";

export class UserFindById {
    public constructor(private readonly repository: UserRepository) {}

    public async run(id: string): Promise<User> {
        return await this.repository.findById(new UserId(id));
    }
}
