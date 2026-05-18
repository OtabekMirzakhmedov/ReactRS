import { render, screen, fireEvent } from '@testing-library/react';
import Search from './Search';

describe('Search', () => {
  it('renders input with initialValue', () => {
    render(<Search initialValue="pikachu" onSearch={vi.fn()} />);
    expect(screen.getByDisplayValue('pikachu')).toBeInTheDocument();
  });

  it('renders search button', () => {
    render(<Search initialValue="" onSearch={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
  });

  it('updates input value when user types', () => {
    render(<Search initialValue="" onSearch={vi.fn()} />);
    fireEvent.change(screen.getByPlaceholderText('Search Pokémon...'), {
      target: { value: 'bulbasaur' },
    });
    expect(screen.getByDisplayValue('bulbasaur')).toBeInTheDocument();
  });

  it('calls onSearch with trimmed value on button click', () => {
    const onSearch = vi.fn();
    render(<Search initialValue="  pikachu  " onSearch={onSearch} />);
    fireEvent.click(screen.getByRole('button', { name: 'Search' }));
    expect(onSearch).toHaveBeenCalledWith('pikachu');
  });

  it('calls onSearch with empty string when input is cleared', () => {
    const onSearch = vi.fn();
    render(<Search initialValue="pikachu" onSearch={onSearch} />);
    fireEvent.change(screen.getByDisplayValue('pikachu'), { target: { value: '' } });
    fireEvent.click(screen.getByRole('button', { name: 'Search' }));
    expect(onSearch).toHaveBeenCalledWith('');
  });
});
