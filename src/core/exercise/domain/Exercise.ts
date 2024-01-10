// src\core\exercise\domain\Exercise.ts

import { ExerciseId } from "./ExerciseId";

export class Exercise {
    private readonly _id: ExerciseId;
    private _name: string;
    private _typeOfExercise: string;
    private _series: number;
    private _repetitions: string;
    private _rest: number;
    private _weight: number;
    private readonly _createdAt: Date;
    private _updatedAt: Date | undefined;
    private _isDeleted: boolean;

    public constructor(
        id: ExerciseId,
        name: string,
        typeOfExercise: string,
        series: number,
        repetitions: string,
        rest: number,
        weight: number,
        createdAt?: Date,
        updatedAt?: Date | undefined,
        isDeleted = false,
    ) {
        this._id = id;
        this._name = name;
        this._typeOfExercise = typeOfExercise;
        this._series = series;
        this._repetitions = repetitions;
        this._rest = rest;
        this._weight = weight;
        this._createdAt = createdAt || new Date();
        this._updatedAt = updatedAt;
        this._isDeleted = isDeleted;
    }

    // Métodos de obtención (getters) para acceder a propiedades privadas
    public get id(): ExerciseId {
        return this._id;
    }

    public get name(): string {
        return this._name;
    }

    public get typeOfExercise(): string {
        return this._typeOfExercise;
    }

    public get series(): number {
        return this._series;
    }

    public get repetitions(): string {
        return this._repetitions;
    }

    public get rest(): number {
        return this._rest;
    }

    public get weight(): number {
        return this._weight;
    }

    public get createdAt(): Date {
        return this._createdAt;
    }

    public get updatedAt(): Date | undefined {
        return this._updatedAt;
    }

    public get isDeleted(): boolean {
        return this._isDeleted;
    }

    // Método para marcar el exercise como eliminado
    public delete(): void {
        this._isDeleted = true;
        this.setUpdatedAt();
    }

    // Métodos para actualizar
    public setUpdatedAt(): void {
        this._updatedAt = new Date();
    }

    public updateName(name: string): void {
        this._name = this.validateName(name);
        this.setUpdatedAt();
    }

    public updateTypeOfExercise(name: string): void {
        this._typeOfExercise = this.validateName(name);
        this.setUpdatedAt();
    }

    public updateSeries(serie: number): void {
        this._series = this.validateNumber(serie);
        this.setUpdatedAt();
    }

    public updateRepetitions(repetion: string): void {
        this._repetitions = repetion;
        this.setUpdatedAt();
    }

    public updateRest(rest: number): void {
        this._rest = this.validateNumber(rest);
        this.setUpdatedAt();
    }

    public updateWeight(weight: number): void {
        this._weight = this.validateNumber(weight);
        this.setUpdatedAt();
    }

    // Métodos para validar name y number
    private validateName(name: string): string {
        if (!name || name.trim().length < 2) {
            throw new Error("El nombre debe tener al menos dos caracteres.");
        }
        return name.trim();
    }

    private validateNumber(num: number): number {
        if (!num || num < 0) {
            throw new Error("El número debe ser positivo.")
        }
        return num;
    }

    // Método estático para registrar un nuevo exercise, `constructor semántico`
    public static register(name: string, typeOfExercise: string, series: number, repetitions: string, rest: number, weight: number): Exercise {
        const id = ExerciseId.random();
        return new Exercise(id, name, typeOfExercise, series, repetitions, rest, weight);
    }
}
