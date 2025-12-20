import { SearchQuery, PaginationParams } from '../infrastructure/ports/ITodoRepository';

/**
 * Parse comma-separated array
 */
export function parseCommaSeparatedArray(string?: string): string[] | undefined {
  if (!string) return undefined;
  return string.split(',').map((t) => t.trim()).filter(Boolean);
}

/**
 * Parse pagination parameters from query with defaults
 */
export function parsePaginationParams(query: {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}): PaginationParams {
  return {
    page: query.page || 1,
    pageSize: query.pageSize || 20,
    sortBy: query.sortBy || 'created_at',
    sortOrder: query.sortOrder || 'desc',
  };
}

/**
 * Build SearchQuery from raw query parameters
 */
export function buildSearchQuery(query: {
  q?: string;
  tags?: string;
  status?: string;
  priority?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}): SearchQuery {
  return {
    q: query.q,
    tags: parseCommaSeparatedArray(query.tags),
    status: parseCommaSeparatedArray(query.status),
    priority: parseCommaSeparatedArray(query.priority),
    pagination: parsePaginationParams(query),
  };
}
