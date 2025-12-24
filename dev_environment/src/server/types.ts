import { Logger, RequestHandler, RouteMethod } from "../../../src/core/server";
import { TodoService } from "./services/todo.service";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface CustomPluginPluginSetup {}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface CustomPluginPluginStart {}

export type WithService = <
  P = unknown,
  Q = unknown,
  B = unknown,
  M extends RouteMethod = RouteMethod
>(
  handler: (
    service: TodoService,
    context: Parameters<RequestHandler<P, Q, B, M>>[0],
    request: Parameters<RequestHandler<P, Q, B, M>>[1],
    response: Parameters<RequestHandler<P, Q, B, M>>[2]
  ) => ReturnType<RequestHandler<P, Q, B, M>>,
  logger: Logger
) => RequestHandler<P, Q, B, M>;
