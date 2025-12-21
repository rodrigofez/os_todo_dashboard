import { render, RenderOptions, RenderResult } from '@testing-library/react';
import React from 'react';
import { TestProviders } from '../providers/TestProviders';
import { QueryClient } from '@tanstack/react-query';
import { createMockHttpSetup } from '../mocks/mockHttpSetup';
import { createMockQueryClient } from '../providers/mockQueryClient';

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  queryClient?: QueryClient;
  httpSetup?: ReturnType<typeof createMockHttpSetup>;
}

/**
 * Custom render function that wraps components with all necessary providers
 */
export const renderWithProviders = (
  ui: React.ReactElement,
  {
    queryClient = createMockQueryClient(),
    httpSetup = createMockHttpSetup(),
    ...renderOptions
  }: CustomRenderOptions = {}
): RenderResult & {
  queryClient: QueryClient;
  httpSetup: ReturnType<typeof createMockHttpSetup>;
} => {
  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <TestProviders queryClient={queryClient} httpSetup={httpSetup}>
      {children}
    </TestProviders>
  );

  return {
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
    queryClient,
    httpSetup,
  };
};
