// MongoUserRepository.ts

// Importa las interfaces y tipos necesarios de MongoDB y la función de conexión a la base de datos
import { Collection, WithId, Document, ObjectId } from 'mongodb';
import { dbConnection } from '../mongodb/connections/Connection';

// Importaciones desde el dominio
import { UserModel } from '../../domain/models/UserModel';
import { UserRepository } from '../../domain/repositories/UserRepository';

// Clase que implementa la interfaz UserRepository y se conecta a MongoDB
export class MongoUserRepository implements UserRepository {
  // Propiedad privada que representa la colección de usuarios en la base de datos
  private collection?: Collection;

  constructor() {
    this.connect();
  }

  //  Establece la conexión con la base de datos.
  private async connect(): Promise<void> {
    const db = await dbConnection();
    this.collection = db.collection('users');
    if (!this.collection) {
      throw new Error(
        'The connection to the users Collection of the database is not established',
      );
    }
  }

  // Obtiene todos los usuarios de la base de datos.
  async findAllUsers(): Promise<WithId<Document>[]> {
    try {
      const userDocs = await this.collection!.find().toArray();
      return userDocs;
    } catch (error: any) {
      throw new Error('Error getting users list');
    }
  }

  async findUserById(id: string): Promise<WithId<Document>> {
    try {
      const idUser = { _id: new ObjectId(id) };
      const userDoc = await this.collection!.findOne(idUser);
      return userDoc!;
    } catch (error) {
      throw new Error('Error gettin user.');
    }
  }

  async createUser(user: UserModel): Promise<void> {
    try {
      await this.collection!.insertOne(user);
    } catch (error) {
      throw new Error('Error insert user.');
    }
  }

  async updateUserById(id: string, user: UserModel): Promise<void> {
    try {
      const idUser = { _id: new ObjectId(id) };
      await this.collection!.updateOne(idUser, { $set: user });
    } catch (error) {
      throw new Error('Error update user.');
    }
  }

  async deleteUserById(id: string): Promise<void> {
    try {
      const idUser = { _id: new ObjectId(id) };
      await this.collection!.deleteOne(idUser);
    } catch (error) {
      throw new Error('Error delete user.');
    }
  }
}
