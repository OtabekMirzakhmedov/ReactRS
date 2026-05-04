import { Component } from 'react';
import Header from './components/Header';
import Search from './components/Search';
import CardList from './components/CardList';
import Loader from './components/Loader';
import ErrorBoundary from './components/ErrorBoundary';
import TestErrorButton from './components/TestErrorButton';
import { fetchPokemonByName, fetchPokemonList } from './services/pokemonService';
import { PokemonCard } from './types/pokemon';
import './App.css';

const STORAGE_KEY = 'pokemon_search_term';

interface State {
  searchTerm: string;
  pokemons: PokemonCard[];
  loading: boolean;
  error: string | null;
}

export default class App extends Component<{}, State> {
  constructor(props: {}) {
    super(props);
    const saved = localStorage.getItem(STORAGE_KEY) ?? '';
    this.state = {
      searchTerm: saved,
      pokemons: [],
      loading: false,
      error: null,
    };
  }

  componentDidMount() {
    console.log('App mounted');
    this.fetchPokemons(this.state.searchTerm);
  }

  componentDidUpdate(_prevProps: {}, prevState: State) {
    if (prevState.searchTerm !== this.state.searchTerm) {
      console.log('Search term changed:', this.state.searchTerm);
    }
  }

  componentWillUnmount() {
    console.log('App unmounted');
  }

  fetchPokemons = async (term: string) => {
    this.setState({ loading: true, error: null });
    try {
      const pokemons = term
        ? await fetchPokemonByName(term)
        : await fetchPokemonList();
      this.setState({ pokemons, loading: false });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      this.setState({ error: message, loading: false, pokemons: [] });
    }
  };

  handleSearch = (term: string) => {
    localStorage.setItem(STORAGE_KEY, term);
    this.setState({ searchTerm: term });
    this.fetchPokemons(term);
  };

  render() {
    const { searchTerm, pokemons, loading, error } = this.state;
    return (
      <div className="app">
        <div className="top-section">
          <Header />
          <Search initialValue={searchTerm} onSearch={this.handleSearch} />
        </div>
        <div className="bottom-section">
          <ErrorBoundary>
            <TestErrorButton />
            {loading && <Loader />}
            {!loading && error && <p className="error-message">{error}</p>}
            {!loading && !error && <CardList pokemons={pokemons} />}
          </ErrorBoundary>
        </div>
      </div>
    );
  }
}
