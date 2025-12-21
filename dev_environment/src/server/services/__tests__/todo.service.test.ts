import { TodoService } from '../../../server/services/todo.service';
import { TodoEntity } from '../../../server/domain/entities/Todo';
import { DetailedMetrics, TodoPriority, TodoStatus } from '../../../common';
import { TodoNotFoundError } from '../../../server/domain/exceptions/todoDomain.exception';
import { ITodoRepository } from '../../../server/infrastructure/ports/ITodoRepository';

describe('TodoService', () => {
  let service: TodoService;
  let mockRepository: jest.Mocked<ITodoRepository>;
  let mockLogger: any;

  beforeEach(() => {
    mockRepository = {
      save: jest.fn(),
      update: jest.fn(),
      findById: jest.fn(),
      delete: jest.fn(),
      exists: jest.fn(),
      search: jest.fn(),
      getOverviewMetrics: jest.fn(),
      getDetailedMetrics: jest.fn(),
    } as any;

    mockLogger = {
      debug: jest.fn(),
      info: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
    };

    service = new TodoService(mockRepository, mockLogger);
  });

  describe('createTodo', () => {
    it('should save new todo via repository', async () => {
      const todoData = {
        title: 'Test Todo',
        priority: TodoPriority.HIGH,
        description: 'Test description',
        tags: []
      };

      TodoEntity.create(todoData);

      const result = await service.createTodo(todoData);

      expect(mockRepository.save).toHaveBeenCalled();
      expect(result.title).toBe('Test Todo');
    });
  });

  describe('getTodoById', () => {
    it('should return todo if found', async () => {
      const todo = TodoEntity.create({ title: 'Test', priority: TodoPriority.HIGH });
      mockRepository.findById.mockResolvedValue(todo);

      const result = await service.getTodoById('123');

      expect(mockRepository.findById).toHaveBeenCalledWith('123');
      expect(result.title).toBe('Test');
      expect(result.priority).toBe(TodoPriority.HIGH);
      expect(result.status).toBe(TodoStatus.PLANNED);
    });

    it('should throw TodoNotFoundError if not found', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(service.getTodoById('999')).rejects.toThrow(TodoNotFoundError);
    });
  });

  describe('updateTodo', () => {
    it('should update existing todo', async () => {
      const existingTodo = TodoEntity.create({ title: 'Old', priority: TodoPriority.LOW });

      mockRepository.findById.mockResolvedValue(existingTodo);

      const result = await service.updateTodo('123', { title: 'New' });

      expect(mockRepository.findById).toHaveBeenCalledWith('123');
      expect(mockRepository.update).toHaveBeenCalled();
      expect(result.title).toBe('New');
      expect(result.updated_at).toBeDefined();
    });

    it('should throw TodoNotFoundError if not found', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(service.updateTodo('999', { title: 'New' }))
        .rejects.toThrow(TodoNotFoundError);
    });
  });

  describe('deleteTodo', () => {
    it('should delete existing todo', async () => {
      mockRepository.exists.mockResolvedValue(true);
      mockRepository.delete.mockResolvedValue(undefined);

      await service.deleteTodo('123');

      expect(mockRepository.exists).toHaveBeenCalledWith('123');
      expect(mockRepository.delete).toHaveBeenCalledWith('123');
    });

    it('should throw TodoNotFoundError if not found', async () => {
      mockRepository.exists.mockResolvedValue(false);

      await expect(service.deleteTodo('999')).rejects.toThrow(TodoNotFoundError);
    });
  });

  describe('getAllTodos', () => {
    it('should apply default pagination', async () => {
      const mockResponse = {
        data: [],
        pagination: { total: 0, page: 1, pageSize: 20, totalPages: 0 },
      };
      mockRepository.search.mockResolvedValue(mockResponse);

      const result = await service.getAllTodos({});

      expect(mockRepository.search).toHaveBeenCalledWith({
        pagination: {
          page: 1,
          pageSize: 20,
          sortBy: 'created_at',
          sortOrder: 'desc',
        },
      });
      expect(result).toBe(mockResponse);
    });

    it('should use provided query parameters', async () => {
      const mockResponse = {
        data: [],
        pagination: { total: 0, page: 2, pageSize: 50, totalPages: 0 },
      };
      mockRepository.search.mockResolvedValue(mockResponse);

      await service.getAllTodos({
        q: 'search',
        pagination: {
          page: 2,
          pageSize: 50,
        },
      });

      expect(mockRepository.search).toHaveBeenCalledWith(
        expect.objectContaining({
          q: 'search',
          pagination: expect.objectContaining({
            page: 2,
            pageSize: 50,
          }),
        })
      );
    });
  });

  describe('getMetrics', () => {
    it('should delegate to repository for overview metrics', async () => {
      const mockMetrics = { completed: 10, due_soon: 2, errors: 1, overdue: 2, total: 2 };
      mockRepository.getOverviewMetrics.mockResolvedValue(mockMetrics);

      const result = await service.getOverviewMetrics();

      expect(mockRepository.getOverviewMetrics).toHaveBeenCalled();
      expect(result).toBe(mockMetrics);
    });

    it('should delegate to repository for detailed metrics', async () => {
      const mockMetrics = { byStatus: {}, byPriority: {} } as DetailedMetrics;
      mockRepository.getDetailedMetrics.mockResolvedValue(mockMetrics);

      const result = await service.getDetailedMetrics();

      expect(mockRepository.getDetailedMetrics).toHaveBeenCalled();
      expect(result).toBe(mockMetrics);
    });
  });
});
