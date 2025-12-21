import React from 'react';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '../../../__test-utils__/helpers/renderWithProviders';
import { createMockTodo } from '../../../__test-utils__/mocks/mockTodos';
import { TodoForm } from '../TodoForm';

describe('TodoForm', () => {
  const mockOnSuccess = jest.fn();
  const formId = 'test-form';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render all form fields', () => {
    renderWithProviders(<TodoForm formId={formId} onSuccess={mockOnSuccess} />);

    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/priority/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/assignee/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/due date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/tags/i)).toBeInTheDocument();
  });

  it('should show validation errors for required fields', async () => {
    renderWithProviders(
      <>
        <TodoForm formId={formId} onSuccess={mockOnSuccess} />
        <button data-test-subj="submit-form" type='submit' form={formId} />
      </>);

    const submitButton = screen.getByTestId('submit-form');
    submitButton.click();

    await waitFor(() => {
      expect(screen.getByText(/title is required/i)).toBeInTheDocument();
      expect(screen.getByText(/assignee is required/i)).toBeInTheDocument();
      expect(screen.getByText(/due date is required/i)).toBeInTheDocument();
    });
  });

  it('should submit form with valid data', async () => {
    const mockTodo = createMockTodo();
    const { httpSetup } = renderWithProviders(
      <>
        <TodoForm formId={formId} onSuccess={mockOnSuccess} />
        <button data-test-subj="submit-form" type='submit' form={formId} />
      </>
    );

    httpSetup.post.mockResolvedValueOnce(mockTodo);

    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'Test Todo' } });
    fireEvent.change(screen.getByLabelText(/assignee/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/due date/i), { target: { value: '12/12/2027' } });


    const submitButton = screen.getByTestId('submit-form');
    submitButton.click();

    await waitFor(() => {
      expect(httpSetup.post).toHaveBeenCalled();
      expect(mockOnSuccess).toHaveBeenCalled();
    });
  });

  it('should display error message on submission failure', async () => {
    const { httpSetup } = renderWithProviders(
      <>
        <TodoForm formId={formId} onSuccess={mockOnSuccess} />
        <button data-test-subj="submit-form" type='submit' form={formId} />
      </>
    );

    httpSetup.post.mockRejectedValueOnce(new Error('Network error'));

    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'Test Todo' } });
    fireEvent.change(screen.getByLabelText(/assignee/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/due date/i), { target: { value: '12/12/2027' } });

    const submitButton = screen.getByTestId('submit-form');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/error creating task/i)).toBeInTheDocument();
    }, { timeout: 10000 });
  });
});
