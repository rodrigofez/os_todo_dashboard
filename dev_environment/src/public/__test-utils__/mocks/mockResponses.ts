import { PaginatedResponse, Todo } from '../../../common';
import { createMockTodoList } from './mockTodos';

/**
 * Factory function to create a mock PaginatedResponse
 */
export const createMockPaginatedResponse = (
  data: Todo[] = createMockTodoList(),
  overrides?: Partial<PaginatedResponse<Todo>>
): PaginatedResponse<Todo> => ({
  data,
  pagination: {
    total: data.length,
    page: 1,
    pageSize: 20,
    totalPages: Math.ceil(data.length / 20),
  },
  ...overrides,
});
