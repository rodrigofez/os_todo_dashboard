import {
  renderHook,
  RenderHookOptions,
  WrapperComponent,
} from '@testing-library/react-hooks';
import React, { ReactNode } from 'react';
import { TestProviders } from '../providers/TestProviders';
import { QueryClient } from '@tanstack/react-query';
import { createMockHttpSetup } from '../mocks/mockHttpSetup';
import { createMockQueryClient } from '../providers/mockQueryClient';

interface CustomRenderHookOptions<TProps>
  extends Omit<RenderHookOptions<TProps>, 'wrapper'> {
  queryClient?: QueryClient;
  httpSetup?: ReturnType<typeof createMockHttpSetup>;
}

export function renderHookWithProviders<TProps, TResult>(
  hook: (props: TProps) => TResult,
  {
    queryClient = createMockQueryClient(),
    httpSetup = createMockHttpSetup(),
    ...options
  }: CustomRenderHookOptions<TProps> = {} as CustomRenderHookOptions<TProps>
) {
  const Wrapper: WrapperComponent<TProps> = ({ children }: { children?: ReactNode }) => (
    <TestProviders queryClient={queryClient} httpSetup={httpSetup}>
      {children}
    </TestProviders>
  );

  const result = renderHook<TProps, TResult>(hook, {
    wrapper: Wrapper,
    ...options,
  });

  return {
    ...(result as ReturnType<typeof renderHook<TProps, TResult>>),
    queryClient,
    httpSetup,
  };
}
