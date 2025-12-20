import { schema, TypeOf } from '@osd/config-schema';

export const createTodoSchema = schema.object({
  title: schema.string({ minLength: 1, maxLength: 200 }),
  description: schema.maybe(schema.string({ maxLength: 2000 })),
  assignee: schema.maybe(schema.string({ minLength: 1, maxLength: 200 })),
  status: schema.maybe(
    schema.oneOf([
      schema.literal('planned'),
      schema.literal('in_progress'),
      schema.literal('completed'),
      schema.literal('error'),
    ])
  ),
  tags: schema.arrayOf(schema.string(), { defaultValue: [] }),
  priority: schema.oneOf([
    schema.literal('low'),
    schema.literal('medium'),
    schema.literal('high'),
    schema.literal('critical'),
  ]),
  due_date: schema.maybe(schema.string()),
});

export const updateTodoSchema = schema.object({
  title: schema.maybe(schema.string({ minLength: 1, maxLength: 200 })),
  description: schema.maybe(schema.string({ maxLength: 2000 })),
  status: schema.maybe(
    schema.oneOf([
      schema.literal('planned'),
      schema.literal('in_progress'),
      schema.literal('completed'),
      schema.literal('error'),
    ])
  ),
  tags: schema.maybe(schema.arrayOf(schema.string())),
  priority: schema.maybe(
    schema.oneOf([
      schema.literal('low'),
      schema.literal('medium'),
      schema.literal('high'),
      schema.literal('critical'),
    ])
  ),
  assignee: schema.maybe(schema.string()),
  completed_date: schema.maybe(schema.string()),
  due_date: schema.maybe(schema.string()),
});

export const getTodosQuerySchema = schema.object({
  q: schema.maybe(schema.string()),
  status: schema.maybe(schema.string()),
  tags: schema.maybe(schema.string()),
  title: schema.maybe(schema.string()),
  priority: schema.maybe(schema.string()),
  page: schema.maybe(schema.number({ defaultValue: 1, min: 1 })),
  pageSize: schema.maybe(schema.number({ defaultValue: 20, min: 1, max: 100 })),
  sortBy: schema.maybe(schema.string()),
  sortOrder: schema.maybe(
    schema.oneOf([schema.literal('asc'), schema.literal('desc')], {
      defaultValue: 'desc',
    })
  ),
});

export const searchQuerySchema = schema.object({
  q: schema.maybe(schema.string()),
  tags: schema.maybe(schema.string()),
  status: schema.maybe(schema.string()),
  page: schema.maybe(schema.number({ defaultValue: 1 })),
  pageSize: schema.maybe(schema.number({ defaultValue: 20 })),
  sortBy: schema.maybe(schema.string()),
  sortOrder: schema.maybe(
    schema.oneOf([schema.literal('asc'), schema.literal('desc')], {
      defaultValue: 'desc',
    })
  ),
});

export const todoIdSchema = schema.object({
  id: schema.string(),
});

export type CreateTodoSchemaType = TypeOf<typeof createTodoSchema>;
export type UpdateTodoSchemaType = TypeOf<typeof updateTodoSchema>;
export type GetTodosQuerySchemaType = TypeOf<typeof getTodosQuerySchema>;
export type SearchQuerySchemaType = TypeOf<typeof searchQuerySchema>;
export type TodoIdSchemaType = TypeOf<typeof todoIdSchema>;
