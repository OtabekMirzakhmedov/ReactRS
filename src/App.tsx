import { useEffect, useState } from 'react';
import { Link, Outlet, useNavigate, useSearchParams } from 'react-router-dom';
import Header from './components/Header';
import Search from './components/Search';
import CardList from './components/CardList';
import Loader from './components/Loader';
import ErrorBoundary from './components/ErrorBoundary';
import TestErrorButton from './components/TestErrorButton';
import Pagination from './components/Pagination';
import DetailPanel from './components/DetailPanel';
import { fetchPokemonByName, fetchPokemonList } from './services/pokemonService';
import { useLocalStorage } from './hooks/useLocalStorage';
import { PokemonCard } from './types/pokemon';
import './App.css';

const STORAGE_KEY = 'pokemon_search_term';
const PAGE_SIZE = 20;

export default function App() {
  const [searchTerm, setSearchTerm] = useLocalStorage(STORAGE_KEY, '');
  const [pokemons, setPokemons] = useState<PokemonCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const page = parseInt(searchParams.get('page') ?? '1', 10);
  const hasDetails = Boolean(searchParams.get('details'));

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    const doFetch = async () => {
      try {
        if (searchTerm) {
          const result = await fetchPokemonByName(searchTerm);
          if (!cancelled) {
            setPokemons(result);
            setTotal(result.length);
          }
        } else {
          const { pokemons: list, total: count } = await fetchPokemonList(page, PAGE_SIZE);
          if (!cancelled) {
            setPokemons(list);
            setTotal(count);
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'An error occurred');
          setPokemons([]);
          setTotal(0);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    doFetch();
    return () => {
      cancelled = true;
    };
  }, [searchTerm, page]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');
    params.delete('details');
    navigate(`?${params.toString()}`);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', String(newPage));
    params.delete('details');
    navigate(`?${params.toString()}`);
  };

  const totalPages = searchTerm ? 1 : Math.ceil(total / PAGE_SIZE);

  return (
    <div className="app">
      <div className="top-section">
        <Header />
        <nav className="main-nav">
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
        </nav>
        <Search initialValue={searchTerm} onSearch={handleSearch} />
      </div>
      <div className={`bottom-section${hasDetails ? ' bottom-section--split' : ''}`}>
        <ErrorBoundary>
          <div className="main-panel">
            <TestErrorButton />
            {loading && <Loader />}
            {!loading && error && <p className="error-message">{error}</p>}
            {!loading && !error && <CardList pokemons={pokemons} />}
            {!loading && !error && <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />}
          </div>
          {hasDetails && (
            <div className="detail-wrapper">
              <DetailPanel />
            </div>
          )}
        </ErrorBoundary>
      </div>
      <Outlet />
    </div>
  );
}
