import { Request } from "express";
import { WithId, Document } from "mongodb";

import { FindAllExercises } from '../../application/exercise-use-cases/FindAllExercises';


export class ExerciseController {
    constructor(
        public findAllExercises: FindAllExercises
        
    ) { }

    async getAllExercises(): Promise<WithId<Document>[]> {
        return await this.findAllExercises.run();
    }

}