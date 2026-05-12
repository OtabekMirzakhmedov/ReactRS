import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';
import { fetchPokemonList, fetchPokemonByName } from './services/pokemonService';

vi.mock('./services/pokemonService');

const mockFetchPokemonList = vi.mocked(fetchPokemonList);
const mockFetchPokemonByName = vi.mocked(fetchPokemonByName);

const STORAGE_KEY = 'pokemon_search_term';

beforeEach(() => {
  vi.resetAllMocks();
  vi.spyOn(console, 'error').mockImplementation(() => {});
  localStorage.clear();
});

describe('App', () => {
  describe('localStorage', () => {
    it('reads saved search term from localStorage on mount', () => {
      localStorage.setItem(STORAGE_KEY, 'pikachu');
      mockFetchPokemonByName.mockResolvedValue([{ name: 'Pikachu', description: 'Types: electric' }]);
      render(<App />);
      expect(screen.getByDisplayValue('pikachu')).toBeInTheDocument();
    });

    it('writes search term to localStorage when user searches', async () => {
      mockFetchPokemonList.mockResolvedValue([]);
      mockFetchPokemonByName.mockResolvedValue([{ name: 'Pikachu', description: 'Types: electric' }]);
      render(<App />);
      await waitFor(() => expect(mockFetchPokemonList).toHaveBeenCalled());

      fireEvent.change(screen.getByPlaceholderText('Search Pokémon...'), {
        target: { value: 'pikachu' },
      });
      fireEvent.click(screen.getByRole('button', { name: 'Search' }));

      expect(localStorage.getItem(STORAGE_KEY)).toBe('pikachu');
    });
  });

  describe('API calls', () => {
    it('calls fetchPokemonList on mount when no saved search term', async () => {
      mockFetchPokemonList.mockResolvedValue([]);
      render(<App />);
      await waitFor(() => expect(mockFetchPokemonList).toHaveBeenCalledTimes(1));
    });

    it('calls fetchPokemonByName on mount when saved search term exists', async () => {
      localStorage.setItem(STORAGE_KEY, 'pikachu');
      mockFetchPokemonByName.mockResolvedValue([{ name: 'Pikachu', description: 'Types: electric' }]);
      render(<App />);
      await waitFor(() => expect(mockFetchPokemonByName).toHaveBeenCalledWith('pikachu'));
    });

    it('calls fetchPokemonByName with correct term on search', async () => {
      mockFetchPokemonList.mockResolvedValue([]);
      mockFetchPokemonByName.mockResolvedValue([{ name: 'Pikachu', description: 'Types: electric' }]);
      render(<App />);
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
      const { container } = render(<App />);
      expect(container.querySelector('.loader-container')).toBeInTheDocument();
    });
  });

  describe('error handling', () => {
    it('shows error message when API call fails', async () => {
      mockFetchPokemonList.mockRejectedValue(new Error('Network error'));
      render(<App />);
      await waitFor(() => expect(screen.getByText('Network error')).toBeInTheDocument());
    });

    it('clears error and shows results on successful retry', async () => {
      mockFetchPokemonList.mockRejectedValueOnce(new Error('Network error'));
      mockFetchPokemonByName.mockResolvedValue([{ name: 'Pikachu', description: 'Types: electric' }]);
      render(<App />);
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
      mockFetchPokemonList.mockResolvedValue([
        { name: 'Pikachu', description: 'Types: electric' },
        { name: 'Bulbasaur', description: 'Types: grass' },
      ]);
      render(<App />);
      await waitFor(() => expect(screen.getByText('Pikachu')).toBeInTheDocument());
      expect(screen.getByText('Bulbasaur')).toBeInTheDocument();
    });

    it('hides Loader after fetch completes', async () => {
      mockFetchPokemonList.mockResolvedValue([{ name: 'Pikachu', description: 'Types: electric' }]);
      const { container } = render(<App />);
      await waitFor(() => expect(container.querySelector('.loader-container')).not.toBeInTheDocument());
    });
  });
});
