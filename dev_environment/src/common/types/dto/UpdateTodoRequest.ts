import { TodoStatus, TodoPriority } from '../enums';

export interface UpdateTodoRequest {
  title?: string;
  description?: string;
  status?: TodoStatus;
  tags?: string[];
  priority?: TodoPriority;
  assignee?: string;
  completed_date?: string;
  due_date?: string;
}
