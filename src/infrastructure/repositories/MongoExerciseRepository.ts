import { Collection, WithId, Document, ObjectId } from "mongodb";
import { dbConnection } from "../mongodb/connections/Connection";
import { ExerciseRepository } from "../../domain/repositories/ExerciseRepository";
import { ExerciseModel } from "../../domain/models/ExerciseModel";

export class MongoExerciseRepository implements ExerciseRepository {
    private collection?: Collection;

    constructor() { this.connect(); }

    private async connect(): Promise<void> {
        const db = await dbConnection();
        this.collection = db.collection('exercises');
        if (!this.collection) {
            throw new Error('The connection to the exercises Collection of the database is not established');
        }
    }

    async findAllExercises(): Promise<WithId<Document>[]> {
        try {
            return await this.collection!.find().toArray();
        } catch (error) {
            throw new Error("Error getting exercises list.");
        }
    }

}