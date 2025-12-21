import { TodoStatus } from '../../../common';
import { InvalidStatusTransitionError } from '../exceptions/todoDomain.exception';
import { Status } from '../value-objects/Status';

describe('Status', () => {
  describe('valid transitions', () => {
    it('should allow PLANNED → IN_PROGRESS', () => {
      const status = new Status(TodoStatus.PLANNED);
      const newStatus = status.transitionTo(TodoStatus.IN_PROGRESS);
      expect(newStatus.getValue()).toBe(TodoStatus.IN_PROGRESS);
    });

    it('should allow IN_PROGRESS → COMPLETED', () => {
      const status = new Status(TodoStatus.IN_PROGRESS);
      const newStatus = status.transitionTo(TodoStatus.COMPLETED);
      expect(newStatus.getValue()).toBe(TodoStatus.COMPLETED);
    });

    it('should allow COMPLETED → PLANNED', () => {
      const status = new Status(TodoStatus.COMPLETED);
      const newStatus = status.transitionTo(TodoStatus.PLANNED);
      expect(newStatus.getValue()).toBe(TodoStatus.PLANNED);
    });

    it('should allow ERROR → PLANNED', () => {
      const status = new Status(TodoStatus.ERROR);
      const newStatus = status.transitionTo(TodoStatus.PLANNED);
      expect(newStatus.getValue()).toBe(TodoStatus.PLANNED);
    });
  });

  describe('invalid transitions', () => {
    it('should throw InvalidStatusTransitionError for PLANNED → COMPLETED', () => {
      const status = new Status(TodoStatus.PLANNED);
      expect(() => status.transitionTo(TodoStatus.COMPLETED))
        .toThrow(InvalidStatusTransitionError);
    });

    it('should throw InvalidStatusTransitionError for COMPLETED → IN_PROGRESS', () => {
      const status = new Status(TodoStatus.COMPLETED);
      expect(() => status.transitionTo(TodoStatus.IN_PROGRESS))
        .toThrow(InvalidStatusTransitionError);
    });
  });

  describe('canTransitionTo', () => {
    it('should return true for valid transitions', () => {
      const status = new Status(TodoStatus.PLANNED);
      expect(status.canTransitionTo(TodoStatus.IN_PROGRESS)).toBe(true);
      expect(status.canTransitionTo(TodoStatus.ERROR)).toBe(true);
    });

    it('should return false for invalid transitions', () => {
      const status = new Status(TodoStatus.PLANNED);
      expect(status.canTransitionTo(TodoStatus.COMPLETED)).toBe(false);
    });
  });

  describe('type checks', () => {
    it('should identify completed status', () => {
      const completed = new Status(TodoStatus.COMPLETED);
      const planned = new Status(TodoStatus.PLANNED);

      expect(completed.isCompleted()).toBe(true);
      expect(planned.isCompleted()).toBe(false);
    });

    it('should identify error status', () => {
      const error = new Status(TodoStatus.ERROR);
      const planned = new Status(TodoStatus.PLANNED);

      expect(error.isError()).toBe(true);
      expect(planned.isError()).toBe(false);
    });

    it('should identify in progress status', () => {
      const inProgress = new Status(TodoStatus.IN_PROGRESS);
      const planned = new Status(TodoStatus.PLANNED);

      expect(inProgress.isInProgress()).toBe(true);
      expect(planned.isInProgress()).toBe(false);
    });
  });
});
