import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { I18nProvider } from '@osd/i18n/react';
import { ApiProvider } from '../../context/ApiContext';
import { createMockHttpSetup } from '../mocks/mockHttpSetup';
import { createMockQueryClient } from './mockQueryClient';

interface TestProvidersProps {
  children: React.ReactNode;
  queryClient?: QueryClient;
  httpSetup?: ReturnType<typeof createMockHttpSetup>;
}

/**
 * Wrapper component that provides all necessary contexts for testing
 */
export const TestProviders: React.FC<TestProvidersProps> = ({
  children,
  queryClient = createMockQueryClient(),
  httpSetup = createMockHttpSetup(),
}) => {
  return (
    <I18nProvider>
      <BrowserRouter>
        <ApiProvider http={httpSetup as any}>
          <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </ApiProvider>
      </BrowserRouter>
    </I18nProvider>
  );
};
