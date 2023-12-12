// src\core\user\domain\User.ts

import { ObjectId } from "../../shared/domain/ObjectId";
import { UserId } from "./UserId";

export class User {
    private readonly id: UserId;
    private name: string;
    private email: string;

    public constructor(
        id: UserId,
        name: string,
        email: string
    ) {
        this.id = id;
        this.name = name;
        this.email = email;
    }

    public getIdValue(): string {
        return this.id.value;
    }

    public getName(): string {
        return this.name;
    }

    public getEmail(): string {
        return this.email;
    }

    public static register(name: string, email: string): User {
        return new User(
            UserId.random(),
            name,
            email
        );
    }


}