import { QueryClient } from "@tanstack/react-query";

/**
 * react QueryClient for testing
 */
export const createMockQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
    logger: {
      log: console.log,
      warn: console.warn,
      error: () => { },
    },
  });
};
