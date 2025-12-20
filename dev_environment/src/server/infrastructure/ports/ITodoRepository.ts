import { Todo, PaginatedResponse, OverviewMetrics, DetailedMetrics } from "../../../common";
import { TodoEntity } from "../../domain/entities/Todo";

export interface TodoFilters {
  q?: string;
  tags?: string[];
  status?: string;
  priority?: string;
}

export interface PaginationParams {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface SearchQuery {
  q?: string;
  tags?: string[];
  status?: string[];
  priority?: string[];
  pagination?: PaginationParams;
}

export interface ITodoRepository {
  save(todo: TodoEntity): Promise<void>;
  update(id: string, todo: TodoEntity): Promise<void>;
  findById(id: string): Promise<TodoEntity | null>;
  delete(id: string): Promise<void>;
  search(query: SearchQuery): Promise<PaginatedResponse<Todo>>;
  exists(id: string): Promise<boolean>;
  getOverviewMetrics(): Promise<OverviewMetrics>;
}
