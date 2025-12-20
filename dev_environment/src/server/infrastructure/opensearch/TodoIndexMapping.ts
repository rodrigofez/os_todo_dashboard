import { IndexName, IndicesAlias, MappingTypeMapping } from "@opensearch-project/opensearch/api/types";

export const TODO_INDEX_MAPPING: {
  aliases?: Record<IndexName, IndicesAlias>
  mappings?: Record<string, MappingTypeMapping> | MappingTypeMapping
  settings?: Record<string, any>
} = {
  settings: {
    number_of_shards: 1,
    number_of_replicas: 1,
    analysis: {
      analyzer: {
        todo_analyzer: {
          type: 'standard',
          stopwords: '_english_',
        },
      },
    },
  },
  mappings: {
    properties: {
      id: { type: 'keyword' },
      title: {
        type: 'text',
        analyzer: 'todo_analyzer',
        fields: {
          keyword: { type: 'keyword' },
        },
      },
      description: {
        type: 'text',
        analyzer: 'todo_analyzer',
      },
      assignee: { type: 'keyword' },
      status: { type: 'keyword' },
      tags: { type: 'keyword' },
      priority: { type: 'keyword' },
      category: { type: 'keyword' },
      created_by: { type: 'keyword' },
      updated_by: { type: 'keyword' },
      created_at: { type: 'date' },
      updated_at: { type: 'date' },
      planned_date: { type: 'date' },
      completed_date: { type: 'date' },
      due_date: { type: 'date' },
      recurrence: {
        type: 'object',
        properties: {
          frequency: { type: 'keyword' },
          next_occurrence: { type: 'date' },
        },
      },
      result: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          message: { type: 'text' },
        },
      },
      related_items: {
        type: 'nested',
        properties: {
          type: { type: 'keyword' },
          id: { type: 'keyword' },
          name: { type: 'text' },
        },
      },
      archived: { type: 'boolean' },
      comments: {
        type: 'nested',
        properties: {
          author: { type: 'keyword' },
          text: { type: 'text' },
          timestamp: { type: 'date' },
        },
      },
      metadata: { type: 'object', enabled: true },
    },
  },
};
