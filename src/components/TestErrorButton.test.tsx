import { render, screen, fireEvent } from '@testing-library/react';
import TestErrorButton from './TestErrorButton';
import ErrorBoundary from './ErrorBoundary';

beforeEach(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

describe('TestErrorButton', () => {
  it('renders the trigger button', () => {
    render(
      <ErrorBoundary>
        <TestErrorButton />
      </ErrorBoundary>
    );
    expect(screen.getByRole('button', { name: 'Trigger Error (test)' })).toBeInTheDocument();
  });

  it('triggers error boundary on click', () => {
    render(
      <ErrorBoundary>
        <TestErrorButton />
      </ErrorBoundary>
    );
    fireEvent.click(screen.getByRole('button', { name: 'Trigger Error (test)' }));
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('Test error triggered by user')).toBeInTheDocument();
  });
});
