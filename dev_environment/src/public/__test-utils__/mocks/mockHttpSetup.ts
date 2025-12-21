/**
 * Mock implementation of OpenSearch Dashboards HttpSetup
 * Used for testing components and hooks that depend on HTTP client
 */
export const createMockHttpSetup = () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
  fetch: jest.fn(),
  basePath: {
    get: jest.fn(() => ''),
    prepend: jest.fn((path: string) => path),
    remove: jest.fn((path: string) => path),
    serverBasePath: '',
  },
  anonymousPaths: {
    isAnonymous: jest.fn(() => false),
    register: jest.fn(),
  },
  externalUrl: {
    validateUrl: jest.fn(() => null),
  },
  intercept: jest.fn(),
  removeAllInterceptors: jest.fn(),
  addLoadingCountSource: jest.fn(),
  getLoadingCount$: jest.fn(),
});

export type MockHttpSetup = ReturnType<typeof createMockHttpSetup>;
