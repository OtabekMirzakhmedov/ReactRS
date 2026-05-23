import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useSearchParams } from 'react-router-dom';
import CardList from './CardList';
import { useSelectionStore } from '../store/selectionStore';

function SearchDisplay() {
  const [params] = useSearchParams();
  return <div data-testid="search">{params.toString()}</div>;
}

const renderWithRouter = (ui: React.ReactElement) =>
  render(<MemoryRouter>{ui}</MemoryRouter>);

beforeEach(() => {
  useSelectionStore.setState({ selectedItems: new Set() });
});

const pokemons = [
  { name: 'Pikachu', description: 'Types: electric' },
  { name: 'Bulbasaur', description: 'Types: grass, poison' },
];

describe('CardList', () => {
  it('renders "No Pokémon found." when list is empty', () => {
    renderWithRouter(<CardList pokemons={[]} />);
    expect(screen.getByText('No Pokémon found.')).toBeInTheDocument();
  });

  it('renders a card for each pokemon', () => {
    renderWithRouter(<CardList pokemons={pokemons} />);
    expect(screen.getByText('Pikachu')).toBeInTheDocument();
    expect(screen.getByText('Bulbasaur')).toBeInTheDocument();
  });

  it('renders the correct number of cards', () => {
    const three = [
      { name: 'Pikachu', description: 'Types: electric' },
      { name: 'Bulbasaur', description: 'Types: grass' },
      { name: 'Charmander', description: 'Types: fire' },
    ];
    renderWithRouter(<CardList pokemons={three} />);
    expect(screen.getAllByRole('heading').length).toBe(3);
  });

  it('renders a checkbox for each card', () => {
    renderWithRouter(<CardList pokemons={pokemons} />);
    expect(screen.getAllByRole('checkbox').length).toBe(pokemons.length);
  });

  it('checking a card adds it to the selection store', () => {
    renderWithRouter(<CardList pokemons={pokemons} />);
    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[0]);
    expect(useSelectionStore.getState().selectedItems.has('Pikachu')).toBe(true);
  });

  it('unchecking a card removes it from the selection store', () => {
    useSelectionStore.setState({ selectedItems: new Set(['Pikachu']) });
    renderWithRouter(<CardList pokemons={pokemons} />);
    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[0]);
    expect(useSelectionStore.getState().selectedItems.has('Pikachu')).toBe(false);
  });

  it('checkboxes reflect current store selection state', () => {
    useSelectionStore.setState({ selectedItems: new Set(['Pikachu']) });
    renderWithRouter(<CardList pokemons={pokemons} />);
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes[0]).toBeChecked();
    expect(checkboxes[1]).not.toBeChecked();
  });

  it('clicking a card adds details param to the URL', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<><CardList pokemons={pokemons} /><SearchDisplay /></>} />
        </Routes>
      </MemoryRouter>
    );
    fireEvent.click(screen.getByRole('button', { name: /pikachu/i }));
    expect(screen.getByTestId('search').textContent).toContain('details=pikachu');
  });

  it('clicking the same card again removes the details param', () => {
    render(
      <MemoryRouter initialEntries={['/?details=pikachu']}>
        <Routes>
          <Route path="/" element={<><CardList pokemons={pokemons} /><SearchDisplay /></>} />
        </Routes>
      </MemoryRouter>
    );
    fireEvent.click(screen.getByRole('button', { name: /pikachu/i }));
    expect(screen.getByTestId('search').textContent).not.toContain('details=pikachu');
  });
});
