import { IRouter, Logger } from '../../../../src/core/server';
import { TodoService } from '../services/todo.service';
import { OpenSearchTodoRepository } from '../infrastructure/repositories/OpenSearchTodoRepository';

// track if repository has been initialized to avoid repeated initialization
let repositoryInitialized = false;

const withService = (
  handler: (service: TodoService, context: any, request: any, response: any) => Promise<any>, logger: Logger
) => {
  return async (context: any, request: any, response: any) => {
    try {
      const client = context.core.opensearch.client.asCurrentUser;

      const repository = new OpenSearchTodoRepository(client, logger);

      if (!repositoryInitialized) {
        await repository.initialize();
        repositoryInitialized = true;
      }

      const service = new TodoService(repository, logger);

      return await handler(service, context, request, response);
    } catch (error) {
      logger.error(`Error in route handler: ${error}`);
      throw error;
    }
  };
};

export function registerTodoRoutes(
  router: IRouter,
  logger: Logger
): void {
}
