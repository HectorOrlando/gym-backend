// src\core\user\domain\UserId.ts

import { ObjectId } from '../../shared/domain/ObjectId';

export class UserId extends ObjectId {
  public static random(): UserId {
    return new UserId(super.random().value);
  }
}
