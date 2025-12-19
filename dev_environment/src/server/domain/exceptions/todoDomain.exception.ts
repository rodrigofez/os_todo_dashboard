export class TodoDomainException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TodoDomainException';
    Object.setPrototypeOf(this, TodoDomainException.prototype);
  }
}

export class TodoNotFoundError extends TodoDomainException {
  constructor(id: string) {
    super(`Todo with id ${id} not found`);
    this.name = 'TodoNotFoundError';
    Object.setPrototypeOf(this, TodoNotFoundError.prototype);
  }
}

export class InvalidStatusTransitionError extends TodoDomainException {
  constructor(from: string, to: string) {
    super(`Invalid status transition from ${from} to ${to}`);
    this.name = 'InvalidStatusTransitionError';
    Object.setPrototypeOf(this, InvalidStatusTransitionError.prototype);
  }
}

export class ValidationError extends TodoDomainException {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}
