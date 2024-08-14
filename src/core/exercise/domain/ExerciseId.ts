// src\core\exercise\domain\ExerciseId.ts

import { ObjectId } from '../../shared/domain/ObjectId';

export class ExerciseId extends ObjectId {
  public static random(): ExerciseId {
    return new ExerciseId(super.random().value);
  }
}
