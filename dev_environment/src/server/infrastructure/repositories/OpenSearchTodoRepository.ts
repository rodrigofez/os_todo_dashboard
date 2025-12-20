import { Logger, OpenSearchClient } from "../../../../../src/core/server";
import {
  TODO_INDEX_NAME
} from "../../../common";
import { TODO_INDEX_MAPPING } from "../opensearch/TodoIndexMapping";
import {
  ITodoRepository,
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
}
