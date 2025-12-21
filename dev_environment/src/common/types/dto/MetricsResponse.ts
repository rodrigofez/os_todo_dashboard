/**
 * Overview metrics response
 */
export interface OverviewMetrics {
  overdue: number;
  due_soon: number;
  errors: number;
  completed: number;
  total: number;
}

/**
 * Status count for metrics
 */
export interface StatusCount {
  status: string;
  count: number;
}

/**
 * Priority count for metrics
 */
export interface PriorityCount {
  priority: string;
  count: number;
}

/** d
 * Tag count for metrics
 */
export interface TagCount {
  tag: string;
  count: number;
}

/**
 * Daily metrics for created and completed tasks
 */
export interface DailyMetrics {
  day: string;
  created: number;
  completed: number;
}

/**
 * Detailed metrics response
 */
export interface DetailedMetrics {
  total: number;
  completed: number;
  pending: number;
  failed: number;
  completionRate: number;
  byStatus: StatusCount[];
  byPriority: PriorityCount[];
  byTag: TagCount[];
  byDate: DailyMetrics[];
}
