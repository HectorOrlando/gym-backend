// NotFoundError.ts

// Definimos una clase NotFoundError que extiende de la clase Error.
export class NotFoundError extends Error {
    // Definimos dos propiedades adicionales para la clase NotFoundError.
    // Estas propiedades se utilizan para almacenar información adicional sobre el error.
    statusCode: number;
    code: string;

    // Constructor de la clase NotFoundError que recibe un mensaje como parámetro.
    constructor(message: string) {
        // Llamamos al constructor de la clase Error con el mensaje proporcionado.
        super(message);
        // Establecemos la propiedad statusCode con el valor 404, que corresponde al código de estado HTTP 404 (Not Found).
        this.statusCode = 404;
        // Establecemos la propiedad code con el valor 'NOT_FOUND', que es un identificador para este tipo de error.
        this.code = 'NOT_FOUND';
    }
}
