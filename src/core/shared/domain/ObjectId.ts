// src\core\shared\domain\ObjectId.ts

import { ObjectId as MongoObjectID } from 'mongodb';

// Esto podría ser una clase abstracta
export class ObjectId {
  public readonly value: string;

  public constructor(id: string) {
    this.checkIsValid(id);
    this.value = new MongoObjectID(id).toHexString();
  }

  public static random(): ObjectId {
    const id = new MongoObjectID().toHexString();

    return new ObjectId(id);
  }

  protected checkIsValid(value: string): void {
    if (!MongoObjectID.isValid(value)) {
      throw new Error(`Id is not valid. ${value}`);
    }
  }
}
