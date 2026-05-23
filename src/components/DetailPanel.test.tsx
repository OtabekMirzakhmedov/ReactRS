import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import DetailPanel from './DetailPanel';
import { fetchPokemonDetail } from '../services/pokemonService';

vi.mock('../services/pokemonService');
const mockFetchPokemonDetail = vi.mocked(fetchPokemonDetail);

const mockDetail = {
  id: 25,
  name: 'pikachu',
  types: [{ slot: 1, type: { name: 'electric', url: '' } }],
  height: 4,
  weight: 60,
  base_experience: 112,
  stats: [
    { base_stat: 35, stat: { name: 'hp' } },
    { base_stat: 55, stat: { name: 'attack' } },
  ],
};

const renderWithRoute = (search = '') =>
  render(
    <MemoryRouter initialEntries={[`/${search}`]}>
      <Routes>
        <Route path="/" element={<DetailPanel />} />
      </Routes>
    </MemoryRouter>
  );

describe('DetailPanel', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('renders nothing when no details param in URL', () => {
    const { container } = renderWithRoute();
    expect(container.firstChild).toBeNull();
  });

  it('shows loader while fetching', () => {
    mockFetchPokemonDetail.mockReturnValue(new Promise(() => {}));
    const { container } = renderWithRoute('?details=pikachu');
    expect(container.querySelector('.loader-container')).toBeInTheDocument();
  });

  it('renders pokemon details on successful fetch', async () => {
    mockFetchPokemonDetail.mockResolvedValue(mockDetail);
    renderWithRoute('?details=pikachu');
    await waitFor(() => expect(screen.getByText('Pikachu')).toBeInTheDocument());
    expect(screen.getByText('#25')).toBeInTheDocument();
    expect(screen.getByText('electric')).toBeInTheDocument();
    expect(screen.getByText('0.4 m')).toBeInTheDocument();
    expect(screen.getByText('6 kg')).toBeInTheDocument();
    expect(screen.getByText('112')).toBeInTheDocument();
  });

  it('renders stat list', async () => {
    mockFetchPokemonDetail.mockResolvedValue(mockDetail);
    renderWithRoute('?details=pikachu');
    await waitFor(() => screen.getByText('hp'));
    expect(screen.getByText('hp')).toBeInTheDocument();
    expect(screen.getByText('35')).toBeInTheDocument();
  });

  it('shows error message when fetch fails', async () => {
    mockFetchPokemonDetail.mockRejectedValue(new Error('Not found'));
    renderWithRoute('?details=unknown');
    await waitFor(() => expect(screen.getByText('Not found')).toBeInTheDocument());
  });

  it('renders close button', async () => {
    mockFetchPokemonDetail.mockResolvedValue(mockDetail);
    renderWithRoute('?details=pikachu');
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('close button removes details param from URL', async () => {
    mockFetchPokemonDetail.mockResolvedValue(mockDetail);
    renderWithRoute('?details=pikachu');
    fireEvent.click(screen.getByRole('button'));
    await waitFor(() => {
      expect(window.location.search).not.toContain('details');
    });
  });
});
