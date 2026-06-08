import { useEffect, useState } from 'react';
import { fetchPokemonByName, fetchPokemonList } from '../services/pokemonService';
import { PokemonCard } from '../types/pokemon';

const PAGE_SIZE = 20;

export function usePokemonSearch(searchTerm: string, page: number) {
  const [pokemons, setPokemons] = useState<PokemonCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

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

  const totalPages = searchTerm ? 1 : Math.ceil(total / PAGE_SIZE);

  return { pokemons, loading, error, totalPages };
}
