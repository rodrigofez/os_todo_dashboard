import { TodoEntity } from "../entities/Todo";
import { TodoStatus, TodoPriority } from "../../../common";
import { InvalidStatusTransitionError, ValidationError } from "../exceptions/todoDomain.exception";


describe('TodoEntity', () => {
  describe('create', () => {
    it('should create todo with defaults', () => {
      const todo = TodoEntity.create({
        title: 'Test Todo',
        priority: TodoPriority.HIGH,
      });

      expect(todo['id']).toBeDefined();
      expect(todo['title']).toBe('Test Todo');
      expect(todo['status'].getValue()).toBe(TodoStatus.PLANNED);
      expect(todo['tags']).toEqual([]);
    });

    it('should throw ValidationError for empty title', () => {
      expect(() => TodoEntity.create({ title: '', priority: TodoPriority.HIGH }))
        .toThrow(ValidationError);
    });

    it('should throw ValidationError for title > 200 chars', () => {
      const longTitle = 'a'.repeat(201);
      expect(() => TodoEntity.create({ title: longTitle, priority: TodoPriority.HIGH }))
        .toThrow(ValidationError);
    });

    it('should throw ValidationError for description > 2000 chars', () => {
      const longDescription = 'a'.repeat(2001);
      expect(() => TodoEntity.create({
        title: 'Test',
        priority: TodoPriority.HIGH,
        description: longDescription,
      })).toThrow(ValidationError);
    });
  });

  describe('updateStatus', () => {
    it('should set completedDate when transitioning to COMPLETED', () => {
      const todo = TodoEntity.create({ title: 'Test', priority: TodoPriority.HIGH });
      todo.updateStatus(TodoStatus.IN_PROGRESS);

      expect(todo['completedDate']).toBeUndefined();

      todo.updateStatus(TodoStatus.COMPLETED);

      expect(todo['status'].getValue()).toBe(TodoStatus.COMPLETED);
      expect(todo['completedDate']).toBeDefined();
    });

    it('should throw InvalidStatusTransitionError for invalid transition', () => {
      const todo = TodoEntity.create({ title: 'Test', priority: TodoPriority.HIGH });

      expect(() => todo.updateStatus(TodoStatus.COMPLETED))
        .toThrow(InvalidStatusTransitionError);
    });
  });

  describe('tags management', () => {
    it('should prevent duplicate tags', () => {
      const todo = TodoEntity.create({ title: 'Test', priority: TodoPriority.HIGH });

      todo.addTag('urgent');
      todo.addTag('urgent');

      expect(todo['tags']).toEqual(['urgent']);
    });

    it('should remove tags', () => {
      const todo = TodoEntity.create({ title: 'Test', priority: TodoPriority.HIGH });

      todo.addTag('urgent');
      todo.addTag('ISO 27001');
      todo.removeTag('urgent');

      expect(todo['tags']).toEqual(['ISO 27001']);
    });
  });

  describe('isOverdue', () => {
    it('should return false if no dueDate', () => {
      const todo = TodoEntity.create({ title: 'Test', priority: TodoPriority.HIGH });
      expect(todo.isOverdue()).toBe(false);
    });

    it('should return false if completed', () => {
      const pastDate = new Date(Date.now() - 24 * 60 * 60 * 1000); // yesterday
      const todo = TodoEntity.create({
        title: 'Test',
        priority: TodoPriority.HIGH,
        dueDate: pastDate,
      });

      todo.updateStatus(TodoStatus.IN_PROGRESS);
      todo.updateStatus(TodoStatus.COMPLETED);

      expect(todo.isOverdue()).toBe(false);
    });

    it('should return true if dueDate < now and not completed', () => {
      const pastDate = new Date(Date.now() - 24 * 60 * 60 * 1000); // yesterday
      const todo = TodoEntity.create({
        title: 'Test',
        priority: TodoPriority.HIGH,
        dueDate: pastDate,
      });

      expect(todo.isOverdue()).toBe(true);
    });
  });
});
