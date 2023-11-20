// Connection.ts

import { MongoClient, Db } from "mongodb";
import dotenv from "dotenv";
dotenv.config();    // Carga las variables de entorno desde .env

// Función para establecer una conexión con la base de datos
export const dbConnection = async (): Promise<Db> => {
    // Obtiene la cadena de conexión a la base de datos desde las variables de entorno
    const mongodbCnn = process.env.MONGODB_CNN;
    // Verifica si la cadena de conexión está definida
    if (!mongodbCnn) {
        throw new Error("MONGODB_CNN environment variable is not defined");
    }

    try {
        // Crea una instancia del cliente de MongoDB usando la cadena de conexión
        const client = new MongoClient(mongodbCnn);
        // Conecta al cliente con el servidor de MongoDB
        await client.connect();
        // Obtiene una instancia de la base de datos
        const db = client.db();
        // Retorna la instancia de la base de datos
        return db;
    } catch (error) {
        throw new Error("Error when starting the database");
    }
};