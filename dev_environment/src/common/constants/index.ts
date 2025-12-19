export const PLUGIN_ID = 'todoPlugin';
export const PLUGIN_NAME = 'TO-DO plugin';
export const TODO_INDEX_NAME = 'todos_index';
export const API_BASE_PATH = '/api/todo_plugin';

// API Route Paths
export const API_ROUTES = {
  HEALTH: `${API_BASE_PATH}/health`,
  TODOS: `${API_BASE_PATH}/todos`,
  TODOS_SEARCH: `${API_BASE_PATH}/todos/search`,
  TODO_BY_ID: (id: string) => `${API_BASE_PATH}/todos/${id}`,
} as const;


