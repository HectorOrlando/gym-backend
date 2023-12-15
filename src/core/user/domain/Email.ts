// src\core\user\domain\Email.ts

// Definición de la clase Email que representa un objeto de valor `Value Object` para direcciones de correo electrónico
export class Email {
    // Propiedad privada que almacena el valor del correo electrónico
    private readonly _value: string;

    // Constructor de la clase que toma un valor de correo electrónico y lo valida al instanciar un objeto Email
    constructor(value: string) {
        this._value = this.validateEmail(value);
    }

    // Método getter que devuelve el valor del correo electrónico
    get value(): string {
        return this._value;
    }

    // Método privado para validar el formato del correo electrónico
    private validateEmail(email: string): string {
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;    // Expresión regular que valida el formato básico de una dirección de correo electrónico
        if (!emailRegex.test(email)) {   // Verifica si el valor del correo electrónico cumple con el formato esperado
            throw new Error("El formato del correo electrónico no es válido."); // Si no cumple, lanza un error indicando que el formato no es válido
        }
        return email.trim();    // Devuelve el valor del correo electrónico después de quitar espacios en blanco adicionales
    }

    // Método para comparar dos objetos Email y determinar si tienen el mismo valor
    equals(email: Email): boolean {
        return this._value === email.value;
    }
}
