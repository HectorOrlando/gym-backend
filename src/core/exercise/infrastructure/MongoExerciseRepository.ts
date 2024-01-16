// Importa las interfaces y tipos necesarios de MongoDB y la función de conexión a la base de datos
import { Collection, ObjectId } from "mongodb";
import { dbConnection } from "../../shared/infrastructure/mongodb/connections/Connection";

import { Exercise, ExerciseId, ExerciseRepository } from "../../exercise/domain";

// Define una interfaz que representa la estructura de los datos almacenados en MongoDB para un ejercicio
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

// Clase que implementa la interfaz ExerciseRepository y se conecta a MongoDB
export class MongoExerciseRepository implements ExerciseRepository {

    // Propiedad privada que representa la colección de ejercicios en la base de datos
    private collection!: Collection<ExercisePrimitives>;

    // Constructor que establece la conexión con la base de datos al instanciar la clase
    constructor() { this.connect(); }

    // Establece la conexión con la base de datos.
    private async connect(): Promise<void> {
        const db = await dbConnection();
        this.collection = db.collection('exercises');

        // Maneja el caso en el que la conexión a la colección no está establecida correctamente
        if (!this.collection) {
            throw new Error('La conexión a la colección de ejercicios en la base de datos no está establecida');
        }
    }

    // Implementación del método de registro de un ejercicio en la base de datos MongoDB
    async register(exercise: Exercise): Promise<void> {
        try {
            // Convierte los datos del ejercicio de dominio a la estructura de datos de MongoDB
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
            };

            // Inserta el ejercicio en la colección de MongoDB
            await this.collection.insertOne(exerciseToRegister);
        } catch (error) {
            // Maneja errores específicos y lanza una excepción personalizada
            throw new Error("Error al insertar el ejercicio en la base de datos.");
        }
    }

    // Implementación del método para recuperar todos los ejercicios de la base de datos
    async findAll(): Promise<Exercise[]> {
        try {
            // Busca todos los ejercicios no eliminados en la colección y los convierte a objetos de dominio
            const exercisesFound = await this.collection.find({ isDeleted: false }).toArray();
            return exercisesFound.map(exercise => {
                return new Exercise(
                    new ExerciseId(exercise._id.toHexString()),
                    exercise.name,
                    exercise.typeOfExercise,
                    exercise.series,
                    exercise.repetitions,
                    exercise.rest,
                    exercise.weight,
                    exercise.createdAt,
                    exercise.updatedAt,
                    exercise.isDeleted
                );
            });
        } catch (error) {
            // Maneja errores específicos y lanza una excepción personalizada
            throw new Error("Error al obtener la lista de ejercicios desde la base de datos.");
        }
    }

    async findById(exerciseId: ExerciseId): Promise<Exercise> {
        try {
            const exercise = await this.collection.findOne({
                _id: new ObjectId(exerciseId.value),
                isDeleted: false
            });
            if (!exercise) {
                throw new Error('El id de exercise no existe.');
            }
            return new Exercise(
                new ExerciseId(exercise._id.toHexString()),
                exercise.name,
                exercise.typeOfExercise,
                exercise.series,
                exercise.repetitions,
                exercise.rest,
                exercise.weight,
                exercise.createdAt,
                exercise.updatedAt,
                exercise.isDeleted
            );
        } catch (error) {
            throw new Error("Error al obtener el ejercicios desde la base de datos.");
        }
    }

    async update(exercise: Exercise): Promise<void> {
        try {
            await this.collection.updateOne(
                { _id: new ObjectId(exercise.id.value) },
                {
                    $set: {
                        name: exercise.name,
                        typeOfExercise: exercise.typeOfExercise,
                        series: exercise.series,
                        repetitions: exercise.repetitions,
                        rest: exercise.rest,
                        weight: exercise.weight,
                        updatedAt: exercise.updatedAt
                    }
                }
            );
        } catch (error) {
            throw new Error("Error al actualizar el ejercicio.");
        }
    }

    async delete(exercise: Exercise): Promise<void> {
        await this.collection.updateOne(
            {_id: new ObjectId(exercise.id.value)},
            {$set: {
                isDeleted: exercise.isDeleted
            }}
        )
    }
}
