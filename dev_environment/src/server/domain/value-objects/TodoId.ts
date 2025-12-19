import { v4 as uuidv4 } from 'uuid';
import { ValidationError } from '../exceptions/todoDomain.exception';

export class TodoId {
  private constructor(private readonly value: string) {
    if (!this.isValid(value)) {
      throw new ValidationError(`Invalid UUID: ${value}`);
    }
  }

  static generate(): TodoId {
    return new TodoId(uuidv4());
  }

  static from(value: string): TodoId {
    return new TodoId(value);
  }

  getValue(): string {
    return this.value;
  }

  equals(other: TodoId): boolean {
    return this.value === other.value;
  }

  private isValid(value: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(value);
  }

  toString(): string {
    return this.value;
  }
}
