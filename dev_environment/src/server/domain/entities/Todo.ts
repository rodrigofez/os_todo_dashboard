import { Todo as TodoInterface, TodoPriority, TodoStatus } from '../../../common';
import { ValidationError } from '../exceptions/todoDomain.exception';
import { Priority } from '../value-objects/Priority';
import { Status } from '../value-objects/Status';
import { TodoId } from '../value-objects/TodoId';

export class TodoEntity {
  private constructor(
    private readonly id: TodoId,
    private title: string,
    private description: string | undefined,
    private assignee: string | undefined,
    private status: Status,
    private tags: string[],
    private priority: Priority,
    private readonly createdAt: Date,
    private updatedAt: Date | undefined,
    private completedDate: Date | undefined,
    private dueDate: Date | undefined
  ) {
    this.validate();
  }

  static create(props: {
    title: string;
    description?: string;
    status?: TodoStatus;
    tags?: string[];
    assignee?: string;
    priority: TodoPriority;
    dueDate?: Date;
  }): TodoEntity {
    return new TodoEntity(
      TodoId.generate(),
      props.title,
      props.description,
      props.assignee,
      new Status(props.status || TodoStatus.PLANNED),
      props.tags || [],
      new Priority(props.priority),
      new Date(),
      undefined,
      undefined,
      props.dueDate
    );
  }

  static fromPersistence(data: TodoInterface): TodoEntity {
    return new TodoEntity(
      TodoId.from(data.id),
      data.title,
      data.description,
      data.assignee,
      new Status(data.status),
      data.tags,
      new Priority(data.priority),
      new Date(data.created_at),
      data.updated_at ? new Date(data.updated_at) : undefined,
      data.completed_date ? new Date(data.completed_date) : undefined,
      data.due_date ? new Date(data.due_date) : undefined
    );
  }

  private validate(): void {
    if (!this.title || this.title.trim().length === 0) {
      throw new ValidationError('Title is required');
    }
    if (this.title.length > 200) {
      throw new ValidationError('Title cannot exceed 200 characters');
    }
    if (this.description && this.description.length > 2000) {
      throw new ValidationError('Description cannot exceed 2000 characters');
    }
  }

  updateTitle(title: string): void {
    this.title = title;
    this.validate();
    this.markAsUpdated();
  }

  updateDescription(description: string | undefined): void {
    this.description = description;
    this.validate();
    this.markAsUpdated();
  }

  updateStatus(newStatus: TodoStatus): void {
    this.status = this.status.transitionTo(newStatus);
    this.markAsUpdated();

    if (this.status.isCompleted()) {
      this.completedDate = new Date();
    }
  }

  updatePriority(priority: TodoPriority): void {
    this.priority = new Priority(priority);
    this.markAsUpdated();
  }

  addTag(tag: string): void {
    if (!this.tags.includes(tag)) {
      this.tags.push(tag);
      this.markAsUpdated();
    }
  }

  removeTag(tag: string): void {
    this.tags = this.tags.filter((t) => t !== tag);
    this.markAsUpdated();
  }


  isOverdue(): boolean {
    if (!this.dueDate || this.status.isCompleted()) {
      return false;
    }
    return this.dueDate < new Date();
  }

  private markAsUpdated(): void {
    this.updatedAt = new Date();
  }

  toPlainObject(): TodoInterface {
    return {
      id: this.id.getValue(),
      title: this.title,
      description: this.description,
      assignee: this.assignee,
      status: this.status.getValue(),
      tags: this.tags,
      priority: this.priority.getValue(),
      created_at: this.createdAt.toISOString(),
      updated_at: this.updatedAt?.toISOString(),
      completed_date: this.completedDate?.toISOString(),
      due_date: this.dueDate?.toISOString(),
    };
  }

  getId(): string {
    return this.id.getValue();
  }

  getStatus(): TodoStatus {
    return this.status.getValue();
  }

  getPriority(): TodoPriority {
    return this.priority.getValue();
  }
}
