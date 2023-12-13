// src\core\user\domain\User.ts

import { UserId } from "./UserId";

// Definición de la clase User
export class User {
    // Propiedades privadas
    private readonly _id: UserId;
    private _name: string;
    private _email: string;
    private _password: string;
    private readonly _createdAt: Date;
    private _updatedAt: Date | undefined;
    private _isDeleted: boolean;
    
    // Constructor public
    public constructor(
        id: UserId,
        name: string,
        email: string,
        password: string,
        createdAt: Date,
        updatedAt: Date | undefined,
        isDeleted: boolean,
    ) {
        // Inicialización de propiedades
        this._id = id;
        this._name = this.validateName(name);
        this._email = this.validateEmail(email);
        this._password = this.validatePassword(password);
        this._createdAt = createdAt;
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

    public get email(): string {
        return this._email;
    }

    public get password(): string {
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
    }

    // Métodos para actualizar el nombre, correo electrónico y contraseña del usuario
    public updateName(name: string): void {
        this._name = this.validateName(name);
        this.updateUpdatedAt();
    }

    public updateEmail(email: string): void {
        this._email = this.validateEmail(email);
        this.updateUpdatedAt();
    }

    public updatePassword(password: string): void {
        this._password = this.validatePassword(password);
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

    private validateEmail(email: string): string {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new Error("El formato del correo electrónico no es válido.");
        }
        return email.trim();
    }

    private validatePassword(password: string): string {
        if (password.length < 8) {
            throw new Error("La contraseña debe tener al menos 8 caracteres.");
        }
        return password;
    }

    // Método estático de la fábrica para registrar un nuevo usuario
    public static register(name: string, email: string, password: string): User {
        const id = UserId.random();
        const createdAt = new Date();
        const updateAt = undefined;
        const isDeleted = false;
        return new User(id, name, email, password, createdAt, updateAt, isDeleted);
    }
}
