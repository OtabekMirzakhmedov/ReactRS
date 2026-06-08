import { Outlet } from 'react-router-dom';
import Header from './components/Header';
import Search from './components/Search';
import CardList from './components/CardList';
import Loader from './components/Loader';
import ErrorBoundary from './components/ErrorBoundary';
import TestErrorButton from './components/TestErrorButton';
import Pagination from './components/Pagination';
import DetailPanel from './components/DetailPanel';
import Flyout from './components/Flyout';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useTheme } from './context/ThemeContext';
import { usePokemonSearch } from './hooks/usePokemonSearch';
import { usePokemonNavigation } from './hooks/usePokemonNavigation';
import './App.css';

const STORAGE_KEY = 'pokemon_search_term';

export default function App() {
  const [searchTerm, setSearchTerm] = useLocalStorage(STORAGE_KEY, '');
  const { theme, toggleTheme } = useTheme();
  const { page, hasDetails, goToPage } = usePokemonNavigation();
  const { pokemons, loading, error, totalPages } = usePokemonSearch(searchTerm, page);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    goToPage(1);
  };

  return (
    <div className="app">
      <div className="top-section">
        <Header />
        <Search initialValue={searchTerm} onSearch={handleSearch} />
        <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === 'dark' ? '☀ Light mode' : '☾ Dark mode'}
        </button>
      </div>
      <div className={`bottom-section${hasDetails ? ' bottom-section--split' : ''}`}>
        <ErrorBoundary>
          <div className="main-panel">
            <TestErrorButton />
            {loading && <Loader />}
            {!loading && error && <p className="error-message">{error}</p>}
            {!loading && !error && <CardList pokemons={pokemons} />}
            {!loading && !error && <Pagination page={page} totalPages={totalPages} onPageChange={goToPage} />}
          </div>
          {hasDetails && (
            <div className="detail-wrapper">
              <DetailPanel />
            </div>
          )}
        </ErrorBoundary>
      </div>
      <Flyout />
      <Outlet />
    </div>
  );
}
