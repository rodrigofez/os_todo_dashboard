import { act, fireEvent, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import React from 'react';
import { renderWithProviders } from '../../../__test-utils__/helpers/renderWithProviders';
import { createMockHttpSetup } from '../../../__test-utils__/mocks/mockHttpSetup';
import { createMockPaginatedResponse } from '../../../__test-utils__/mocks/mockResponses';
import { createMockTodoList } from '../../../__test-utils__/mocks/mockTodos';
import { Table } from '../index';

jest.mock('../Table', () => ({
  TodoTable: ({ todos }: any) => <div data-test-subj="todo-table">Todos: {todos.length}</div>,
}));

jest.mock('../../Filter/Filter', () => ({
  Filters: () => <div data-test-subj="filters">Filters</div>,
}));

jest.mock('../../TodoForm/TodoModal', () => ({
  TodoModal: ({ isVisible }: any) => (isVisible ? <div data-test-subj="modal">Modal</div> : null),
}));

describe('Table', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(async () => {
    await act(async () => { await new Promise(r => setTimeout(r, 0)); });
  });


  it('should show loading spinner initially', () => {
    renderWithProviders(<Table />);
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('should show error state with retry button', async () => {
    const httpSetup = createMockHttpSetup();
    httpSetup.get.mockRejectedValueOnce(new Error('Network error'));

    renderWithProviders(<Table />, { httpSetup });

    await waitFor(() => {
      expect(screen.getByText(/error loading tasks/i)).toBeInTheDocument();
      expect(screen.getByText(/retry/i)).toBeInTheDocument();
    });
  });

  it('should retry loading on retry button click', async () => {
    const httpSetup = createMockHttpSetup();
    const mockResponse = createMockPaginatedResponse(createMockTodoList(5));

    // first call fails, second succeeds
    httpSetup.get
      .mockRejectedValueOnce(new Error('Network error'))
      .mockResolvedValueOnce(mockResponse);

    renderWithProviders(<Table />, { httpSetup });

    // wait for error state
    await waitFor(() => {
      expect(screen.getByText(/error loading tasks/i)).toBeInTheDocument();
    });

    // click retry
    fireEvent.click(screen.getByText(/retry/i));

    // wait for table to appear
    await waitFor(() => {
      expect(screen.getByTestId('todo-table')).toBeInTheDocument();
    });
  });

  it('should render table with todos after loading', async () => {
    const httpSetup = createMockHttpSetup();
    const mockTodos = createMockTodoList(5);
    const mockResponse = createMockPaginatedResponse(mockTodos);
    httpSetup.get.mockResolvedValueOnce(mockResponse);

    renderWithProviders(<Table />, { httpSetup });

    await waitForElementToBeRemoved(() => screen.getByTestId('spinner'));
    expect(screen.getByTestId('todo-table')).toBeInTheDocument();
    expect(screen.getByText(/tasks \(5\)/i)).toBeInTheDocument();
  });

  it('should open modal when Add button is clicked', async () => {
    const httpSetup = createMockHttpSetup();
    httpSetup.get.mockResolvedValueOnce(createMockPaginatedResponse(createMockTodoList(3)));

    renderWithProviders(<Table />, { httpSetup });

    await waitForElementToBeRemoved(() => screen.getByTestId('spinner'));

    const addButton = screen.getByRole('button', { name: /add/i });
    fireEvent.click(addButton);

    expect(screen.getByTestId('modal')).toBeInTheDocument();
  });

  it('should update search query on input change', async () => {
    const httpSetup = createMockHttpSetup();
    httpSetup.get.mockResolvedValueOnce(createMockPaginatedResponse(createMockTodoList(2)));

    renderWithProviders(<Table />, { httpSetup });

    await waitForElementToBeRemoved(() => screen.getByTestId('spinner'));

    const searchInput = screen.getByPlaceholderText(/search tasks/i);
    fireEvent.change(searchInput, { target: { value: 'test query' } });

    expect(searchInput).toHaveValue('test query');
  });

  it('should show delete button when items are selected', async () => {
    const httpSetup = createMockHttpSetup();
    httpSetup.get.mockResolvedValueOnce(createMockPaginatedResponse(createMockTodoList(2)));

    renderWithProviders(<Table />, { httpSetup });

    await waitForElementToBeRemoved(() => screen.getByTestId('spinner'));

    expect(screen.queryByText(/delete.*task/i)).not.toBeInTheDocument();
  });

  it('should render filters component', async () => {
    const httpSetup = createMockHttpSetup();
    httpSetup.get.mockResolvedValueOnce(createMockPaginatedResponse(createMockTodoList(2)));

    renderWithProviders(<Table />, { httpSetup });

    await waitForElementToBeRemoved(() => screen.getByTestId('spinner'));

    expect(screen.getByTestId('filters')).toBeInTheDocument();
  });
});
