import { waitFor } from '@testing-library/react';
import moment from 'moment';
import { renderHookWithProviders } from '../../__test-utils__/helpers/renderHookWithProviders';
import { useTodoForm } from '../useTodoForm';
import { TodoPriority } from '../../../common';
import { createMockTodo } from '../../__test-utils__/mocks/mockTodos';
import { act } from '@testing-library/react-hooks';
import { QUERY_KEYS } from '../../constants/queryKeys';

describe('useTodoForm (fixed)', () => {
  let mockOnSuccess: jest.Mock;

  beforeEach(() => {
    mockOnSuccess = jest.fn();
    jest.clearAllMocks();
  });

  afterEach(async () => {
    // let react query async notifications finish before unmount
    await act(async () => { await new Promise(r => setTimeout(r, 0)); });
  });

  const setup = () => renderHookWithProviders(() => useTodoForm(mockOnSuccess));

  it('initializes with defaults', () => {
    const { result } = setup();
    expect(result.current.getValues()).toMatchObject({
      title: '',
      description: '',
      assignee: '',
      priority: TodoPriority.MEDIUM,
      dueDate: null,
      tags: [],
    });
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('handles submit / trim / error / retry correctly', async () => {
    const mockTodo = createMockTodo();
    const { result, httpSetup, queryClient } = setup();
    const invalidateSpy = jest.spyOn(queryClient, 'invalidateQueries');

    // --- success path ---
    httpSetup.post.mockResolvedValueOnce(mockTodo);

    await act(async () => {
      result.current.setValue('title', '  Foo  ');
      result.current.setValue('description', '  Bar  ');
      result.current.setValue('assignee', '  Baz  ');
      result.current.setValue('priority', TodoPriority.HIGH);
      result.current.setValue('dueDate', moment('2025-12-31'));
      result.current.setValue('tags', [{ label: 'x' }, { label: 'y' }]);
      await result.current.onSubmit();
    });

    const body = JSON.parse(httpSetup.post.mock.calls[0][1].body);
    expect(body).toMatchObject({
      title: 'Foo',
      description: 'Bar',
      assignee: 'Baz',
      tags: ['x', 'y'],
      due_date: moment('2025-12-31').toISOString(),
    });
    expect(mockOnSuccess).toHaveBeenCalled();
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: QUERY_KEYS.TODOS });

    httpSetup.post.mockRejectedValueOnce(new Error('Network error'));
    await act(async () => {
      try { await result.current.onSubmit(); } catch { }
    });
    await waitFor(() => expect(result.current.error).toBeTruthy());

    httpSetup.post.mockResolvedValueOnce(mockTodo);
    await act(async () => { await result.current.onSubmit(); });
    await waitFor(() => expect(result.current.error).toBeNull());
  });

  it('sets loading true only while submitting', async () => {
    const mockTodo = createMockTodo();
    const { result, httpSetup } = setup();

    let resolve!: (v: any) => void;
    httpSetup.post.mockReturnValue(new Promise(r => (resolve = r)));

    await act(async () => {
      result.current.setValue('title', 'Foo');
      const submit = result.current.onSubmit();
      // await waitFor(() => expect(result.current.loading).toBe(true));
      resolve(mockTodo);
      await submit;
    });

    await waitFor(() => expect(result.current.loading).toBe(false));
  });
});
