// src\core\exercise\infrastructure\MongoExerciseRepository.ts

// Importa las interfaces y tipos necesarios de MongoDB y la función de conexión a la base de datos
import { Collection, ObjectId } from "mongodb";
import { dbConnection } from "../../shared/infrastructure/mongodb/connections/Connection";

import { Exercise, ExerciseId, ExerciseRepository } from "../../exercise/domain";

type ExercisePrimitives = {
    _id: ObjectId;
    name: string;
    typeOfExercise: string;
    series: number;
    repetitions: string;
    rest: number;
    weight: number;
    createdAt: Date;
    updatedAt: Date | undefined;
    isDeleted: boolean;
}

export class MongoExerciseRepository implements ExerciseRepository {

    // Propiedad privada que representa la colección de usuarios en la base de datos
    private collection!: Collection<ExercisePrimitives>;
    // Constructor que establece la conexión con la base de datos al instanciar la clase
    constructor() { this.connect(); }

    //  Establece la conexión con la base de datos.
    private async connect(): Promise<void> {
        const db = await dbConnection();
        this.collection = db.collection('exercises');
        if (!this.collection) {
            throw new Error('The connection to the users Collection of the database is not established');
        }
    }

    async register(exercise: Exercise): Promise<void> {

        const exerciseToRegister = {
            _id: new ObjectId(exercise.id.value),
            name: exercise.name,
            typeOfExercise: exercise.typeOfExercise,
            series: exercise.series,
            repetitions: exercise.repetitions,
            rest: exercise.rest,
            weight: exercise.weight,
            createdAt: exercise.createdAt,
            updatedAt: exercise.updatedAt,
            isDeleted: exercise.isDeleted
        }
        await this.collection.insertOne(exerciseToRegister);
    }

}