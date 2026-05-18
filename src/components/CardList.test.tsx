import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CardList from './CardList';

const renderWithRouter = (ui: React.ReactElement) =>
  render(<MemoryRouter>{ui}</MemoryRouter>);

describe('CardList', () => {
  it('renders "No Pokémon found." when list is empty', () => {
    renderWithRouter(<CardList pokemons={[]} />);
    expect(screen.getByText('No Pokémon found.')).toBeInTheDocument();
  });

  it('renders a card for each pokemon', () => {
    const pokemons = [
      { name: 'Pikachu', description: 'Types: electric' },
      { name: 'Bulbasaur', description: 'Types: grass, poison' },
    ];
    renderWithRouter(<CardList pokemons={pokemons} />);
    expect(screen.getByText('Pikachu')).toBeInTheDocument();
    expect(screen.getByText('Bulbasaur')).toBeInTheDocument();
  });

  it('renders the correct number of cards', () => {
    const pokemons = [
      { name: 'Pikachu', description: 'Types: electric' },
      { name: 'Bulbasaur', description: 'Types: grass' },
      { name: 'Charmander', description: 'Types: fire' },
    ];
    renderWithRouter(<CardList pokemons={pokemons} />);
    expect(screen.getAllByRole('heading').length).toBe(3);
  });
});
