// UserModel.ts

// Definición de la clase UserModel
export class UserModel {
    // Propiedades privadas de la clase
    private id: string;
    private name: string;
    private email: string;

    // Constructor de la clase
    constructor(id: string, name: string, email: string) {
        // Inicialización de las propiedades con los valores proporcionados
        this.id = id;
        this.name = name;
        this.email = email;
    }

    // Métodos de acceso para obtener los valores de las propiedades privadas
    public getId(): string { return this.id; }
    public getName(): string { return this.name; }
    public getEmail(): string { return this.email; }

    // Método estático para crear una instancia de UserModel
    public static create(id: string, name: string, email: string): UserModel {
        // Llamada al constructor utilizando la palabra clave 'new'
        return new UserModel(id, name, email);
    }
}
