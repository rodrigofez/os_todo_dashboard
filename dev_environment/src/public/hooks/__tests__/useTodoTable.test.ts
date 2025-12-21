import { waitFor } from '@testing-library/react';
import { act } from '@testing-library/react-hooks';
import { TodoPriority, TodoStatus } from '../../../common';
import { renderHookWithProviders } from '../../__test-utils__/helpers/renderHookWithProviders';
import { createMockPaginatedResponse } from '../../__test-utils__/mocks/mockResponses';
import { useTodoTable } from '../useTodoTable';

jest.mock('../useDebounce', () => ({
  useDebounce: (value: string) => value,
}));

describe('useTodoTable (fixed)', () => {
  beforeEach(() => jest.clearAllMocks());

  // allow React Query async work to settle between tests
  afterEach(async () => {
    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });
  });

  const setup = async () => {
    const mockResponse = createMockPaginatedResponse();

    const utils = renderHookWithProviders(() => useTodoTable(), {
      httpSetup: {
        get: jest.fn().mockResolvedValue(mockResponse),
      } as any,
    });

    // Wait for the hook to finish loading
    await act(async () => { await waitFor(() => expect(utils.result.current.isLoading).toBe(false)); });

    return { ...utils, mockResponse };
  };

  it('initializes with default values', () => {
    const { result } = renderHookWithProviders(() => useTodoTable());
    expect(result.current).toMatchObject({
      pageIndex: 0,
      pageSize: 20,
      sortField: 'created_at',
      sortDirection: 'desc',
      selectedItems: [],
      searchQuery: '',
      selectedStatuses: [],
      selectedPriorities: [],
      isModalVisible: false,
    });
  });

  it('handles pagination and sorting changes', async () => {
    const { result } = await setup();

    await act(async () => {
      result.current.handleTableChange({
        page: { index: 2, size: 50 },
        sort: { field: 'title', direction: 'asc' },
      });
    });

    expect(result.current).toMatchObject({
      pageIndex: 2,
      pageSize: 50,
      sortField: 'title',
      sortDirection: 'asc',
    });
  });

  it('updates search and sends query param', async () => {
    const { result, httpSetup } = await setup();

    await act(async () => {
      result.current.setSearchQuery('fix bug');
    });

    await act(async () => {
      await waitFor(() => {
        const url = httpSetup.get.mock.calls.at(-1)?.[1];
        expect(url.query.q).toContain('fix bug');
      });
    });
  });

  it('updates filters and resets page', async () => {
    const { result, httpSetup } = await setup();

    await act(async () => {
      result.current.handleTableChange({ page: { index: 3, size: 20 } });
      result.current.handleStatusChange([TodoStatus.COMPLETED]);
      result.current.handlePriorityChange([TodoPriority.HIGH]);
    });

    expect(result.current.pageIndex).toBe(0);

    await act(async () => {
      await waitFor(() => {
        const url = httpSetup.get.mock.calls.at(-1)?.[1];
        expect(url.query.status).toContain(TodoStatus.COMPLETED);
        expect(url.query.priority).toContain(TodoPriority.HIGH);
      });
    });
  });

  it('manages modal visibility', async () => {
    const { result } = renderHookWithProviders(() => useTodoTable());
    await act(async () => result.current.openModal());
    expect(result.current.isModalVisible).toBe(true);
    await act(async () => result.current.closeModal());
    expect(result.current.isModalVisible).toBe(false);
  });


  it('exposes loading/error states', async () => {
    const { result, httpSetup } = renderHookWithProviders(() => useTodoTable());
    expect(result.current.isLoading).toBe(true);

    httpSetup.get.mockRejectedValueOnce(new Error('Network error'));
    await act(async () => {
      await waitFor(() => expect(result.current.isError).toBe(true));
    });
  });

  it('exposes todos data and refetch function', async () => {
    const { result, httpSetup, mockResponse } = await setup();

    await act(async () => {
      await waitFor(() => {
        expect(result.current.todos).toEqual(mockResponse);
      });
    });

    expect(typeof result.current.refetch).toBe('function');

    const initialCalls = httpSetup.get.mock.calls.length;

    await act(async () => {
      await result.current.refetch();
    });

    expect(httpSetup.get.mock.calls.length).toBeGreaterThan(initialCalls);
  });


});
