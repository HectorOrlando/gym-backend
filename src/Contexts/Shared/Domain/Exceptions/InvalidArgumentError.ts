import { DomainError } from './DomainError';

export class InvalidArgumentError extends DomainError {
  public static causeCannotBeEmpty(): InvalidArgumentError {
    return new InvalidArgumentError('This field cannot be empty');
  }

  public static causeLengthIsLessThan(requiredLength: number): InvalidArgumentError {
    return new InvalidArgumentError(
      `This field cannot be less than ${requiredLength} characters long`,
    );
  }

  public static causeLengthIsMoreThan(requiredLength: number): InvalidArgumentError {
    return new InvalidArgumentError(
      `This field cannot exceed ${requiredLength} characters`,
    );
  }
}
