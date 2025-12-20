import { Logger, OpenSearchClient } from "../../../../../src/core/server";
import {
  PaginatedResponse,
  Todo,
  TODO_INDEX_NAME
} from "../../../common";
import { TodoEntity } from "../../domain/entities/Todo";
import { OpenSearchDocument, TodoMapper } from "../mappers/TodoMapper";
import { TODO_INDEX_MAPPING } from "../opensearch/TodoIndexMapping";
import {
  ITodoRepository,
  SearchQuery
} from "../ports/ITodoRepository";

export class OpenSearchTodoRepository implements ITodoRepository {
  constructor(
    private readonly client: OpenSearchClient,
    private readonly logger: Logger
  ) { }

  /**
   * Initialize the repository, creates index if it doesn't exist
   */
  async initialize(): Promise<void> {
    this.logger.debug('Initializing TodoRepository...');

    const { body: indexExists } = await this.client.indices.exists({
      index: TODO_INDEX_NAME,
    });

    if (!indexExists) {
      await this.client.indices.create({
        index: TODO_INDEX_NAME,
        body: TODO_INDEX_MAPPING
      });
      this.logger.info(`Created index: ${TODO_INDEX_NAME}`);
    } else {
      this.logger.debug(`Index ${TODO_INDEX_NAME} already exists`);
    }

    this.logger.debug('TodoRepository initialized successfully');
  }

  async save(todo: TodoEntity): Promise<void> {
    const doc = TodoMapper.toPersistence(todo);

    await this.client.index({
      index: TODO_INDEX_NAME,
      id: doc.id,
      body: doc,
      refresh: "wait_for",
    });

    this.logger.debug(`Saved todo with id ${doc.id}`);
  }

  async update(id: string, todo: TodoEntity): Promise<void> {
    const doc = TodoMapper.toPersistence(todo);

    await this.client.update({
      index: TODO_INDEX_NAME,
      id,
      body: {
        doc,
      },
      refresh: "wait_for",
    });

    this.logger.debug(`Updated todo with id ${id}`);
  }

  async findById(id: string): Promise<TodoEntity | null> {
    const { body } = await this.client.get({
      index: TODO_INDEX_NAME,
      id,
    });

    if (!body.found) {
      return null;
    }

    return TodoMapper.toDomain(body._source as OpenSearchDocument);
  }

  async search(query: SearchQuery): Promise<PaginatedResponse<Todo>> {

    const must: any[] = [];

    if (query.q) {
      must.push({
        multi_match: {
          query: query.q,
          fields: ["title^2", "description"],
          fuzziness: "AUTO",
        },
      });
    }

    if (query.tags && query.tags.length > 0) {
      must.push({ terms: { tags: query.tags } });
    }

    if (query.status && query.status.length > 0) {
      must.push({ terms: { status: query.status } });
    }

    if (query.priority && query.priority.length > 0) {
      must.push({ terms: { priority: query.priority } });
    }

    const searchQuery =
      must.length > 0 ? { bool: { must } } : { match_all: {} };

    const pagination = query.pagination || { page: 1, pageSize: 20 };
    const from = (pagination.page - 1) * pagination.pageSize;
    const size = pagination.pageSize;

    const sort: any = {};

    if (pagination.sortBy) {
      sort[pagination.sortBy] = { order: pagination.sortOrder || "desc" };
    }


    const { body } = await this.client.search({
      index: TODO_INDEX_NAME,
      body: {
        query: searchQuery,
        from,
        size,
        sort: pagination.sortBy ? [sort] : undefined,
      },
    });

    const total = typeof body.hits.total == 'number' ? body.hits.total : body.hits.total.value;
    const todos: Todo[] = body.hits.hits.map((hit: any) =>
      TodoMapper.toPlainObject(hit._source as OpenSearchDocument)
    );

    return {
      data: todos,
      pagination: {
        total,
        page: pagination.page,
        pageSize: pagination.pageSize,
        totalPages: Math.ceil(total / pagination.pageSize),
      },
    };
  }
}
