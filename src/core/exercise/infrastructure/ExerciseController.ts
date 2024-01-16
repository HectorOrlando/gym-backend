// src\core\exercise\infrastructure\ExerciseController.ts

import { ExerciseRegister, ExerciseFindAll, ExerciseFindById, ExerciseUpdateById, ExerciseDelete } from "../application";
import { Exercise, ExerciseId } from "../domain";

// Definición de la estructura esperada para las solicitudes de registro de ejercicio
type RegisterExerciseRequest = {
    name: string;
    typeOfExercise: string;
    series: number;
    repetitions: string;
    rest: number;
    weight: number;
}

// Definición de la estructura de la respuesta del ejercicio para la obtención de todos los ejercicios
type ExerciseResponse = {
    id: string;
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

// Controlador de ejercicio que expone métodos para registrar y obtener ejercicios
export class ExerciseController {
    constructor(
        public register: ExerciseRegister,
        public findAll: ExerciseFindAll,
        public findById: ExerciseFindById,
        public updateById: ExerciseUpdateById,
        public deleteById: ExerciseDelete,
    ) { }

    // Método para registrar un nuevo ejercicio utilizando el caso de uso correspondiente
    async registerExercise(request: RegisterExerciseRequest): Promise<void> {
        const { name, typeOfExercise, series, repetitions, rest, weight } = request;
        const exercise = { name, typeOfExercise, series, repetitions, rest, weight }
        await this.register.run(exercise);
    }

    // Método para obtener todos los ejercicios y convertirlos a la estructura de respuesta definida
    async findAllExercises(): Promise<ExerciseResponse[]> {
        const exercises = await this.findAll.run();

        return exercises.map(exercise => {
            return {
                id: exercise.id.value,
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
        })
    }

    // Método para obtener el ejercicio y convertirlos a la estructura de respuesta definida
    async findByIdExercise(id: string): Promise<ExerciseResponse> {
        const exercise = await this.findById.run(id);
        return {
            id: exercise.id.value,
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
    }

    async updateByIdExercise(id: string, request: RegisterExerciseRequest): Promise<void> {
        await this.updateById.run(id, request);
    }

    async deleteByIdExercise(id: string): Promise<void> {
        await this.deleteById.run(id);
    }
}
