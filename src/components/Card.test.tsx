import { render, screen } from '@testing-library/react';
import Card from './Card';

describe('Card', () => {
  it('renders pokemon name', () => {
    render(<Card name="Pikachu" description="Types: electric" />);
    expect(screen.getByText('Pikachu')).toBeInTheDocument();
  });

  it('renders pokemon description', () => {
    render(<Card name="Pikachu" description="Types: electric" />);
    expect(screen.getByText('Types: electric')).toBeInTheDocument();
  });

  it('renders name inside a heading', () => {
    render(<Card name="Bulbasaur" description="Types: grass, poison" />);
    expect(screen.getByRole('heading', { name: 'Bulbasaur' })).toBeInTheDocument();
  });
});
