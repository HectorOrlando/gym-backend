// src\domain\models\ExerciseModel.ts

// Definición de la clase ExerciseModel
export class ExerciseModel {
    // Propiedades privadas de la clase
    private id: string;
    private name: string;
    private typeOfExercise: string;
    private series: number;
    private repetitions: number | string;
    private rest: number;
    private weight: number;

    // Constructor de la clase
    constructor(id: string, name: string, typeOfExercise: string, series: number, repetitions: number | string, rest: number, weight: number) {
        this.id = id;
        this.name = name;
        this.typeOfExercise = typeOfExercise;
        this.series = series;
        this.repetitions = repetitions;
        this.rest = rest;
        this.weight = weight;
    }

    // Métodos de acceso para obtener los valores de las propiedades privadas
    public getId(): string { return this.id };
    public getName(): string { return this.name };
    public getTypeOfExercise(): string { return this.typeOfExercise };
    public getSeries(): number { return this.series };
    public getRepetitions(): number | string { return this.repetitions };
    public getRest(): number { return this.rest };
    public getWeight(): number { return this.weight };

    // Método estático para crear una instancia de ExerciseModel
    public static create(
        id: string,
        name: string,
        typeOfExercise: string,
        series: number,
        repetitions: number | string,
        rest: number,
        weight: number
    ) {
        return new ExerciseModel(id, name, typeOfExercise, series, repetitions, rest, weight);
    }

}