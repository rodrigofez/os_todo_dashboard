import { IRouter, Logger } from '../../../../src/core/server';
import { API_ROUTES, SEED_DATA_COUNT } from '../../common';
import { ErrorHandler } from '../api/middleware/errorHandler';
import {
  createTodoSchema,
  getTodosQuerySchema,
  searchQuerySchema,
  seedSchema,
  todoIdSchema,
  updateTodoSchema,
} from '../api/schemas/todo.schema';
import { TodoService } from '../services/todo.service';
import { buildSearchQuery } from '../utils/queryHelpers';
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

  router.post(
    {
      path: API_ROUTES.TODOS,
      validate: {
        body: createTodoSchema,
      },
    },
    withService(async (service, context, request, response) => {
      try {
        const result = await service.createTodo(request.body);
        return response.ok({ body: result });
      } catch (error) {
        logger.error(`Error creating todo: ${error}`);
        return ErrorHandler.handle(error, response);
      }
    }, logger)
  );

  router.get(
    {
      path: API_ROUTES.TODOS,
      validate: {
        query: getTodosQuerySchema,
      },
    },
    withService(async (service, context, request, response) => {
      try {
        const query = buildSearchQuery(request.query);
        const result = await service.getAllTodos(query);
        return response.ok({ body: result });
      } catch (error) {
        logger.error(`Error getting all todos: ${error}`);
        return ErrorHandler.handle(error, response);
      }
    }, logger)
  );

  router.get(
    {
      path: API_ROUTES.TODOS_SEARCH,
      validate: {
        query: searchQuerySchema,
      },
    },
    withService(async (service, context, request, response) => {
      try {
        const query = buildSearchQuery(request.query);
        const result = await service.searchTodos(query);
        return response.ok({ body: result });
      } catch (error) {
        logger.error(`Error searching todos: ${error}`);
        return ErrorHandler.handle(error, response);
      }
    }, logger)
  );

  router.get(
    {
      path: `${API_ROUTES.TODOS}/{id}`,
      validate: {
        params: todoIdSchema,
      },
    },
    withService(async (service, context, request, response) => {
      try {
        const { id } = request.params;
        const result = await service.getTodoById(id);
        return response.ok({ body: result });
      } catch (error) {
        logger.error(`Error getting todo by id: ${error}`);
        return ErrorHandler.handle(error, response);
      }
    }, logger)
  );

  router.put(
    {
      path: `${API_ROUTES.TODOS}/{id}`,
      validate: {
        params: todoIdSchema,
        body: updateTodoSchema,
      },
    },
    withService(async (service, context, request, response) => {
      try {
        const { id } = request.params;
        const result = await service.updateTodo(id, request.body);
        return response.ok({ body: result });
      } catch (error) {
        logger.error(`Error updating todo: ${error}`);
        return ErrorHandler.handle(error, response);
      }
    }, logger)
  );

  router.delete(
    {
      path: `${API_ROUTES.TODOS}/{id}`,
      validate: {
        params: todoIdSchema,
      },
    },
    withService(async (service, context, request, response) => {
      try {
        const { id } = request.params;
        await service.deleteTodo(id);
        return response.noContent();
      } catch (error) {
        logger.error(`Error deleting todo: ${error}`);
        return ErrorHandler.handle(error, response);
      }
    }, logger)
  );

  router.get(
    {
      path: API_ROUTES.OVERVIEW,
      validate: false,
    },
    withService(async (service, context, request, response) => {
      try {
        const result = await service.getOverviewMetrics();
        return response.ok({ body: result });
      } catch (error) {
        logger.error(`Error fetching overview: ${error}`);
        return ErrorHandler.handle(error, response);
      }
    }, logger)
  );

  router.get(
    {
      path: API_ROUTES.METRICS,
      validate: false,
    },
    withService(async (service, context, request, response) => {
      try {
        const result = await service.getDetailedMetrics();
        return response.ok({ body: result });
      } catch (error) {
        logger.error(`Error fetching metrics: ${error}`);
        return ErrorHandler.handle(error, response);
      }
    }, logger)
  );

  router.post(
    {
      path: API_ROUTES.SEED,
      validate: {
        body: seedSchema,
      },
    },
    withService(async (service, context, request, response) => {
      try {
        const { count } = request.body;
        const result = await service.seedData(count);
        return response.ok({ body: result });
      } catch (error) {
        logger.error(`Error seeding data: ${error}`);
        return ErrorHandler.handle(error, response);
      }
    }, logger)
  );
}
