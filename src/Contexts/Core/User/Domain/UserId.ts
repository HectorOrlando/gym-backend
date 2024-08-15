import { IdValueObject } from '../../../Shared/Domain';

export class UserId extends IdValueObject {
  protected readonly name: string;
  public constructor(value: string) {
    super(value);

    this.name = this.constructor.name;
  }

  public static of(value: string): UserId {
    return super.of(value) as UserId;
  }

  public static random(): UserId {
    return super.random() as UserId;
  }
}
