import { Todo, TodoPriority, TodoStatus } from '../../../common';

/**
 * Factory function to create a mock Todo object
 */
export const createMockTodo = (overrides?: Partial<Todo>): Todo => ({
  id: '1',
  title: 'Test Todo',
  description: 'Test Description',
  status: TodoStatus.PLANNED,
  priority: TodoPriority.MEDIUM,
  assignee: 'John Doe',
  tags: ['test'],
  created_at: '2025-01-01T00:00:00.000Z',
  updated_at: '2025-01-01T00:00:00.000Z',
  due_date: '2025-12-31T00:00:00.000Z',
  completed_date: undefined,
  ...overrides,
});

/**
 * Factory function to create a list of mock Todo objects with varied properties
 */
export const createMockTodoList = (count: number = 5): Todo[] => {
  return Array.from({ length: count }, (_, i) =>
    createMockTodo({
      id: `${i + 1}`,
      title: `Test Todo ${i + 1}`,
      priority: [TodoPriority.LOW, TodoPriority.MEDIUM, TodoPriority.HIGH, TodoPriority.CRITICAL][
        i % 4
      ],
      status: [TodoStatus.PLANNED, TodoStatus.IN_PROGRESS, TodoStatus.COMPLETED, TodoStatus.ERROR][
        i % 4
      ],
    })
  );
};
