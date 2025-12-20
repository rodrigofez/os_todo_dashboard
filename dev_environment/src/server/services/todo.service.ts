import { Logger } from '../../../../src/core/server';
import {
  OverviewMetrics,
  PaginatedResponse,
  Todo,
  TodoPriority,
  TodoStatus,
} from '../../common';
import { CreateTodoSchemaType, UpdateTodoSchemaType } from '../api/schemas/todo.schema';
import { TodoEntity } from '../domain/entities/Todo';
import { TodoNotFoundError } from '../domain/exceptions/todoDomain.exception';
import { ITodoRepository, PaginationParams, SearchQuery } from '../infrastructure/ports/ITodoRepository';

export class TodoService {
  constructor(
    private readonly repository: ITodoRepository,
    private readonly logger: Logger
  ) { }

  async createTodo(data: CreateTodoSchemaType): Promise<Todo> {
    this.logger.debug('TodoService: Creating new todo');

    const todoEntity = TodoEntity.create({
      title: data.title,
      description: data.description,
      status: data.status as TodoStatus,
      assignee: data.assignee,
      tags: data.tags,
      priority: data.priority as TodoPriority,
      dueDate: data.due_date ? new Date(data.due_date) : undefined,
    });

    await this.repository.save(todoEntity);

    const result = todoEntity.toPlainObject();
    this.logger.debug(`TodoService: Todo created with id ${result.id}`);

    return result;
  }

  async updateTodo(id: string, data: UpdateTodoSchemaType): Promise<Todo> {
    this.logger.debug(`TodoService: Updating todo with id ${id}`);

    const todoEntity = await this.repository.findById(id);

    if (!todoEntity) {
      throw new TodoNotFoundError(id);
    }

    if (data.title !== undefined) {
      todoEntity.updateTitle(data.title);
    }

    if (data.description !== undefined) {
      todoEntity.updateDescription(data.description);
    }

    if (data.status !== undefined) {
      todoEntity.updateStatus(data.status as TodoStatus);
    }

    if (data.priority !== undefined) {
      todoEntity.updatePriority(data.priority as TodoPriority);
    }

    await this.repository.update(id, todoEntity);

    const result = todoEntity.toPlainObject();
    this.logger.debug(`TodoService: Todo ${id} updated successfully`);

    return result;
  }

  async deleteTodo(id: string): Promise<void> {
    this.logger.debug(`TodoService: Deleting todo with id ${id}`);

    const exists = await this.repository.exists(id);

    if (!exists) {
      throw new TodoNotFoundError(id);
    }

    await this.repository.delete(id);

    this.logger.debug(`TodoService: Todo ${id} deleted successfully`);
  }


  async getTodoById(id: string): Promise<Todo> {
    this.logger.debug(`TodoService: Fetching todo with id ${id}`);

    const todoEntity = await this.repository.findById(id);

    if (!todoEntity) {
      throw new TodoNotFoundError(id);
    }

    return todoEntity.toPlainObject();
  }


  async getAllTodos(query: SearchQuery): Promise<PaginatedResponse<Todo>> {
    this.logger.debug('TodoService: Fetching all todos');

    const pagination: PaginationParams = {
      page: query.pagination?.page || 1,
      pageSize: query.pagination?.pageSize || 20,
      sortBy: query.pagination?.sortBy || 'created_at',
      sortOrder: query.pagination?.sortOrder || 'desc',
    };

    const result = await this.repository.search({
      ...query,
      pagination,
    });

    this.logger.debug(`TodoService: Found ${result.data.length} todos`);

    return result;
  }

  async searchTodos(query: SearchQuery): Promise<PaginatedResponse<Todo>> {
    this.logger.debug('TodoService: Searching todos');

    const pagination: PaginationParams = {
      page: query.pagination?.page || 1,
      pageSize: query.pagination?.pageSize || 20,
      sortBy: query.pagination?.sortBy || 'created_at',
      sortOrder: query.pagination?.sortOrder || 'desc',
    };

    const result = await this.repository.search({
      ...query,
      pagination,
    });

    this.logger.debug(`TodoService: Found ${result.data.length} todos`);

    return result;
  }

  async getOverviewMetrics(): Promise<OverviewMetrics> {
    this.logger.debug('TodoService: Fetching overview metrics');
    return await this.repository.getOverviewMetrics();
  }
}
