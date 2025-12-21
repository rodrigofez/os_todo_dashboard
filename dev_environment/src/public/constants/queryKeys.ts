export const QUERY_KEYS = {
  TODOS: ['todos'] as const,
  TODOS_WITH_PARAMS: (params: string) => ['todos', params] as const,
  METRICS: ['todos', 'metrics'] as const,
  OVERVIEW_METRICS: ['todos', 'overview-metrics'] as const,
} as const;
