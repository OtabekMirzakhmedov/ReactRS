import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider, useTheme } from './ThemeContext';

function ThemeDisplay() {
  const { theme, toggleTheme } = useTheme();
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <button onClick={toggleTheme}>Toggle</button>
    </div>
  );
}

describe('ThemeContext', () => {
  it('provides dark as the initial theme', () => {
    render(
      <ThemeProvider>
        <ThemeDisplay />
      </ThemeProvider>
    );
    expect(screen.getByTestId('theme').textContent).toBe('dark');
  });

  it('toggleTheme switches from dark to light', () => {
    render(
      <ThemeProvider>
        <ThemeDisplay />
      </ThemeProvider>
    );
    fireEvent.click(screen.getByRole('button', { name: 'Toggle' }));
    expect(screen.getByTestId('theme').textContent).toBe('light');
  });

  it('toggleTheme switches back from light to dark', () => {
    render(
      <ThemeProvider>
        <ThemeDisplay />
      </ThemeProvider>
    );
    fireEvent.click(screen.getByRole('button', { name: 'Toggle' }));
    fireEvent.click(screen.getByRole('button', { name: 'Toggle' }));
    expect(screen.getByTestId('theme').textContent).toBe('dark');
  });

  it('sets data-theme attribute on document.body', () => {
    render(
      <ThemeProvider>
        <ThemeDisplay />
      </ThemeProvider>
    );
    expect(document.body.getAttribute('data-theme')).toBe('dark');
  });

  it('updates data-theme attribute when theme changes', () => {
    render(
      <ThemeProvider>
        <ThemeDisplay />
      </ThemeProvider>
    );
    fireEvent.click(screen.getByRole('button', { name: 'Toggle' }));
    expect(document.body.getAttribute('data-theme')).toBe('light');
  });

  it('useTheme returns default values outside a provider', () => {
    function Bare() {
      const { theme } = useTheme();
      return <span>{theme}</span>;
    }
    render(<Bare />);
    expect(screen.getByText('dark')).toBeInTheDocument();
  });
});
