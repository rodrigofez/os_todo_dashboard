import { TodoPriority } from '../../../common/types/enums';

export class Priority {
  private static readonly PRIORITY_LEVELS = {
    [TodoPriority.LOW]: 1,
    [TodoPriority.MEDIUM]: 2,
    [TodoPriority.HIGH]: 3,
    [TodoPriority.CRITICAL]: 4,
  };

  constructor(private readonly value: TodoPriority) { }

  getValue(): TodoPriority {
    return this.value;
  }

  isHigherThan(other: Priority): boolean {
    return Priority.PRIORITY_LEVELS[this.value] > Priority.PRIORITY_LEVELS[other.value];
  }

  isLowerThan(other: Priority): boolean {
    return Priority.PRIORITY_LEVELS[this.value] < Priority.PRIORITY_LEVELS[other.value];
  }

  equals(other: Priority): boolean {
    return this.value === other.value;
  }

  isCritical(): boolean {
    return this.value === TodoPriority.CRITICAL;
  }

  toString(): string {
    return this.value;
  }
}
