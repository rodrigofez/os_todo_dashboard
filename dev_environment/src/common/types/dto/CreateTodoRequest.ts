import { TodoStatus, TodoPriority } from "../enums";

export interface CreateTodoRequest {
  title: string;
  description?: string;
  status?: TodoStatus;
  tags?: string[];
  priority: TodoPriority;
  assignee?: string;
  due_date?: string;
}
