import { TodoService } from "../services/todo.service";
import { OpenSearchTodoRepository } from "../infrastructure/repositories/OpenSearchTodoRepository";
import { WithService } from "../types";

// track if repository has been initialized to avoid repeated initialization
let repositoryInitialized = false;

export const withService: WithService = (handler, logger) => {
  return async (context, request, response) => {
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
