import { Todo } from '../../../common';
import { TodoEntity } from '../../domain/entities/Todo';

export interface OpenSearchDocument {
  id: string;
  title: string;
  assignee?: string;
  description?: string;
  status: string;
  tags: string[];
  priority: string;
  created_at: string;
  updated_at?: string;
  completed_date?: string;
  due_date?: string;
}

export class TodoMapper {
  static toDomain(doc: OpenSearchDocument): TodoEntity {
    const todoData: Todo = {
      id: doc.id,
      title: doc.title,
      assignee: doc.assignee,
      description: doc.description,
      status: doc.status as Todo['status'],
      tags: doc.tags,
      priority: doc.priority as Todo['priority'],
      created_at: doc.created_at,
      updated_at: doc.updated_at,
      completed_date: doc.completed_date,
      due_date: doc.due_date,
    };

    return TodoEntity.fromPersistence(todoData);
  }

  static toPersistence(todo: TodoEntity): OpenSearchDocument {
    const plainTodo = todo.toPlainObject();

    return {
      id: plainTodo.id,
      title: plainTodo.title,
      assignee: plainTodo.assignee,
      description: plainTodo.description,
      status: plainTodo.status,
      tags: plainTodo.tags,
      priority: plainTodo.priority,
      created_at: plainTodo.created_at,
      updated_at: plainTodo.updated_at,
      completed_date: plainTodo.completed_date,
      due_date: plainTodo.due_date,
    };
  }

  static toPlainObject(doc: OpenSearchDocument): Todo {
    return {
      id: doc.id,
      title: doc.title,
      description: doc.description,
      assignee: doc.assignee,
      status: doc.status as Todo['status'],
      tags: doc.tags,
      priority: doc.priority as Todo['priority'],
      created_at: doc.created_at,
      updated_at: doc.updated_at,
      completed_date: doc.completed_date,
      due_date: doc.due_date,
    };
  }
}
