import {
  IOpenSearchDashboardsResponse,
  OpenSearchDashboardsResponseFactory
} from '../../../../../src/core/server';
import {
  InvalidStatusTransitionError,
  TodoDomainException,
  TodoNotFoundError,
  ValidationError,
} from '../../domain/exceptions/todoDomain.exception';

export interface ErrorResponse {
  error: string;
  message: string;
  statusCode: number;
}

export class ErrorHandler {
  static handle(
    error: unknown,
    response: OpenSearchDashboardsResponseFactory
  ): IOpenSearchDashboardsResponse {
    if (error instanceof TodoNotFoundError) {
      return response.notFound({
        body: {
          message: 'Todo not found'
        }
      });
    }

    if (error instanceof ValidationError) {
      return response.badRequest({
        body: {
          message: 'Invalid request'
        },
      });
    }

    if (error instanceof InvalidStatusTransitionError) {
      return response.custom({
        statusCode: 422,
        body: {
          error: 'Invalid Status Transition',
          message: error.message,
          statusCode: 422,
        },
      });
    }

    if (error instanceof TodoDomainException) {
      return response.custom({
        statusCode: 422,
        body: {
          error: 'Domain Error',
          message: error.message,
          statusCode: 422,
        },
      });
    }

    return response.customError({
      statusCode: 500,
      body: {
        message: error instanceof Error ? error.message : 'An unexpected error occurred',
      },
    });
  }
}
