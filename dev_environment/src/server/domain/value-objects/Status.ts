import { TodoStatus } from '../../../common/types/enums';
import { InvalidStatusTransitionError } from '../exceptions/todoDomain.exception';

export class Status {
  private static readonly VALID_TRANSITIONS: Record<TodoStatus, TodoStatus[]> = {
    [TodoStatus.PLANNED]: [TodoStatus.IN_PROGRESS, TodoStatus.ERROR],
    [TodoStatus.IN_PROGRESS]: [TodoStatus.COMPLETED, TodoStatus.ERROR, TodoStatus.PLANNED],
    [TodoStatus.COMPLETED]: [TodoStatus.PLANNED],
    [TodoStatus.ERROR]: [TodoStatus.PLANNED, TodoStatus.IN_PROGRESS],
  };

  constructor(private readonly value: TodoStatus) { }

  getValue(): TodoStatus {
    return this.value;
  }

  canTransitionTo(newStatus: TodoStatus): boolean {
    return Status.VALID_TRANSITIONS[this.value]?.includes(newStatus) ?? false;
  }

  transitionTo(newStatus: TodoStatus): Status {
    if (!this.canTransitionTo(newStatus)) {
      throw new InvalidStatusTransitionError(this.value, newStatus);
    }
    return new Status(newStatus);
  }

  isCompleted(): boolean {
    return this.value === TodoStatus.COMPLETED;
  }

  isError(): boolean {
    return this.value === TodoStatus.ERROR;
  }

  isInProgress(): boolean {
    return this.value === TodoStatus.IN_PROGRESS;
  }

  equals(other: Status): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
