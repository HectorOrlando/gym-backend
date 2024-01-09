// src\core\user\domain\User.ts

import { UserEmail } from "./UserEmail";
import { UserPassword } from "./UserPassword";
import { UserId } from "./UserId";

// Definición de la clase User
export class User {
    // Propiedades privadas, tambíen se diferencian con el  guión bajo _id, _name
    private readonly _id: UserId;   // reandoly propiedad de solo lectura.
    private _name: string;
    private _email: UserEmail;
    private _password: UserPassword;
    private readonly _createdAt: Date;
    private _updatedAt: Date | undefined;
    private _isDeleted: boolean;

    // Constructor public
    public constructor(
        id: UserId,
        name: string,
        email: UserEmail,
        password: UserPassword,
        createdAt?: Date,
        updatedAt?: Date | undefined,
        isDeleted = false,
    ) {
        // Inicialización de propiedades
        this._id = id;
        this._name = this.validateName(name);
        this._email = email;
        this._password = password;
        this._createdAt = createdAt || new Date();
        this._updatedAt = updatedAt;
        this._isDeleted = isDeleted;
    }

    // Métodos de obtención (getters) para acceder a propiedades privadas
    public get id(): UserId {
        return this._id;
    }

    public get name(): string {
        return this._name;
    }

    public get email(): UserEmail {
        return this._email;
    }

    public get password(): UserPassword {
        return this._password;
    }

    public get createdAt(): Date {
        return this._createdAt;
    }

    public get updatedAt(): Date | undefined {
        return this._updatedAt;
    }

    public get isDeleted(): boolean {
        return this._isDeleted;
    }

    // Método para marcar el usuario como eliminado
    public delete(): void {
        this._isDeleted = true;
        this.updateUpdatedAt();
    }

    // Métodos para actualizar el nombre, correo electrónico y contraseña del usuario
    public updateName(name: string): void {
        this._name = this.validateName(name);
        this.updateUpdatedAt();
    }

    public updateEmail(email: UserEmail): void {
        this._email = email;
        this.updateUpdatedAt();
    }

    public updatePassword(password: string): void {
        this._password = new UserPassword(password);
        this.updateUpdatedAt();
    }

    // Método privado para actualizar la fecha de última modificación
    private updateUpdatedAt(): void {
        this._updatedAt = new Date();
    }

    // Método para obtener el valor del ID como cadena
    public getIdValue(): string {
        return this._id.value;
    }

    // Métodos de validación para nombre, correo electrónico y contraseña
    private validateName(name: string): string {
        if (!name || name.trim().length < 2) {
            throw new Error("El nombre debe tener al menos dos caracteres.");
        }
        return name.trim();
    }

    // Método estático de la fábrica para registrar un nuevo usuario
    // Named constructor -> constructor semántico
    public static register(name: string, email: UserEmail, password: UserPassword): User {
        const id = UserId.random();
        return new User(id, name, email, password);
    }
}
