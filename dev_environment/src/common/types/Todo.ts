import { TodoStatus, TodoPriority } from './enums';

export interface Todo {
  id: string;
  title: string;
  assignee?: string;
  description?: string;
  status: TodoStatus;
  tags: string[];
  priority: TodoPriority;
  created_at: string;
  updated_at?: string;
  completed_date?: string;
  due_date?: string;
}
