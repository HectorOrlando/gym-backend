// src\core\user\domain\UserPassword.ts

export class UserPassword {
    private readonly _value: string;

    constructor(value: string) {
        this._value = this.validatePassword(value);
    }

    get value(): string {
        return this._value;
    }

    private validatePassword(password: string): string {
        if (password.length < 8) {
            throw new Error("La contraseña debe tener al menos 8 caracteres.");
        }
        return password;
    }

    // Puedes agregar métodos adicionales según sea necesario, como métodos para cifrar o verificar la contraseña, etc.
}

