import { randomUUID } from 'node:crypto';

import { InvalidArgumentError } from '../Exceptions/InvalidArgumentError';

const REGEX = /^[\da-f]{8}-[\da-f]{4}-[0-5][\da-f]{3}-[089ab][\da-f]{3}-[\da-f]{12}$/i;

export class IdValueObject {
  public constructor(private readonly _value: string) {
    this.ensureIsValidUuid();
  }

  public static of(id: string): IdValueObject {
    return new this(id);
  }

  public static random(): IdValueObject {
    return new IdValueObject(randomUUID());
  }

  private ensureIsValidUuid(): void {
    if (!REGEX.test(this.value)) {
      throw new InvalidArgumentError(
        `<${this.constructor.name}> does not allow the value <${this.value}>`,
      );
    }
  }

  public equals(other: IdValueObject): boolean {
    return this.value === other.value;
  }

  public get value(): string {
    return this._value;
  }
}
