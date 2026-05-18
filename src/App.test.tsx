import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import { fetchPokemonList, fetchPokemonByName } from './services/pokemonService';

vi.mock('./services/pokemonService');

const mockFetchPokemonList = vi.mocked(fetchPokemonList);
const mockFetchPokemonByName = vi.mocked(fetchPokemonByName);

const STORAGE_KEY = 'pokemon_search_term';

const renderApp = () => render(<MemoryRouter><App /></MemoryRouter>);

beforeEach(() => {
  vi.resetAllMocks();
  vi.spyOn(console, 'error').mockImplementation(() => {});
  localStorage.clear();
});

describe('App', () => {
  describe('localStorage', () => {
    it('reads saved search term from localStorage on mount', () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify('pikachu'));
      mockFetchPokemonByName.mockResolvedValue([{ name: 'Pikachu', description: 'Types: electric' }]);
      renderApp();
      expect(screen.getByDisplayValue('pikachu')).toBeInTheDocument();
    });

    it('writes search term to localStorage when user searches', async () => {
      mockFetchPokemonList.mockResolvedValue({ pokemons: [], total: 0 });
      mockFetchPokemonByName.mockResolvedValue([{ name: 'Pikachu', description: 'Types: electric' }]);
      renderApp();
      await waitFor(() => expect(mockFetchPokemonList).toHaveBeenCalled());

      fireEvent.change(screen.getByPlaceholderText('Search Pokémon...'), {
        target: { value: 'pikachu' },
      });
      fireEvent.click(screen.getByRole('button', { name: 'Search' }));

      expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!)).toBe('pikachu');
    });
  });

  describe('API calls', () => {
    it('calls fetchPokemonList on mount when no saved search term', async () => {
      mockFetchPokemonList.mockResolvedValue({ pokemons: [], total: 0 });
      renderApp();
      await waitFor(() => expect(mockFetchPokemonList).toHaveBeenCalledTimes(1));
    });

    it('calls fetchPokemonByName on mount when saved search term exists', async () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify('pikachu'));
      mockFetchPokemonByName.mockResolvedValue([{ name: 'Pikachu', description: 'Types: electric' }]);
      renderApp();
      await waitFor(() => expect(mockFetchPokemonByName).toHaveBeenCalledWith('pikachu'));
    });

    it('calls fetchPokemonByName with correct term on search', async () => {
      mockFetchPokemonList.mockResolvedValue({ pokemons: [], total: 0 });
      mockFetchPokemonByName.mockResolvedValue([{ name: 'Pikachu', description: 'Types: electric' }]);
      renderApp();
      await waitFor(() => expect(mockFetchPokemonList).toHaveBeenCalled());

      fireEvent.change(screen.getByPlaceholderText('Search Pokémon...'), {
        target: { value: 'pikachu' },
      });
      fireEvent.click(screen.getByRole('button', { name: 'Search' }));

      await waitFor(() => expect(mockFetchPokemonByName).toHaveBeenCalledWith('pikachu'));
    });
  });

  describe('loading state', () => {
    it('shows Loader while fetching', () => {
      mockFetchPokemonList.mockReturnValue(new Promise(() => {}));
      const { container } = renderApp();
      expect(container.querySelector('.loader-container')).toBeInTheDocument();
    });
  });

  describe('error handling', () => {
    it('shows error message when API call fails', async () => {
      mockFetchPokemonList.mockRejectedValue(new Error('Network error'));
      renderApp();
      await waitFor(() => expect(screen.getByText('Network error')).toBeInTheDocument());
    });

    it('clears error and shows results on successful retry', async () => {
      mockFetchPokemonList.mockRejectedValueOnce(new Error('Network error'));
      mockFetchPokemonByName.mockResolvedValue([{ name: 'Pikachu', description: 'Types: electric' }]);
      renderApp();
      await waitFor(() => expect(screen.getByText('Network error')).toBeInTheDocument());

      fireEvent.change(screen.getByPlaceholderText('Search Pokémon...'), {
        target: { value: 'pikachu' },
      });
      fireEvent.click(screen.getByRole('button', { name: 'Search' }));

      await waitFor(() => expect(screen.getByText('Pikachu')).toBeInTheDocument());
    });
  });

  describe('successful fetch', () => {
    it('renders pokemon cards on successful list fetch', async () => {
      mockFetchPokemonList.mockResolvedValue({
        pokemons: [
          { name: 'Pikachu', description: 'Types: electric' },
          { name: 'Bulbasaur', description: 'Types: grass' },
        ],
        total: 2,
      });
      renderApp();
      await waitFor(() => expect(screen.getByText('Pikachu')).toBeInTheDocument());
      expect(screen.getByText('Bulbasaur')).toBeInTheDocument();
    });

    it('hides Loader after fetch completes', async () => {
      mockFetchPokemonList.mockResolvedValue({
        pokemons: [{ name: 'Pikachu', description: 'Types: electric' }],
        total: 1,
      });
      const { container } = renderApp();
      await waitFor(() => expect(container.querySelector('.loader-container')).not.toBeInTheDocument());
    });
  });
});
