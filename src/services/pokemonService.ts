import { PokemonCard, PokemonDetail, PokemonListResponse } from '../types/pokemon';

const API_BASE = 'https://pokeapi.co/api/v2';

const toCard = (pokemon: PokemonDetail): PokemonCard => ({
  name: pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1),
  description: `Types: ${pokemon.types.map((t) => t.type.name).join(', ')}`,
});

export const fetchPokemonByName = async (name: string): Promise<PokemonCard[]> => {
  const res = await fetch(`${API_BASE}/pokemon/${name.toLowerCase()}`);
  if (!res.ok) {
    throw new Error(`Pokémon "${name}" not found (${res.status})`);
  }
  const data: PokemonDetail = await res.json();
  return [toCard(data)];
};

export const fetchPokemonList = async (
  page: number = 1,
  limit: number = 20
): Promise<{ pokemons: PokemonCard[]; total: number }> => {
  const offset = (page - 1) * limit;
  const res = await fetch(`${API_BASE}/pokemon?limit=${limit}&offset=${offset}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch Pokémon list (${res.status})`);
  }
  const data: PokemonListResponse = await res.json();
  const details = await Promise.all(
    data.results.map(({ name }) =>
      fetch(`${API_BASE}/pokemon/${name}`).then((r) => {
        if (!r.ok) throw new Error(`Failed to fetch ${name}`);
        return r.json() as Promise<PokemonDetail>;
      })
    )
  );
  return { pokemons: details.map(toCard), total: data.count };
};

export const fetchPokemonDetail = async (name: string): Promise<PokemonDetail> => {
  const res = await fetch(`${API_BASE}/pokemon/${name.toLowerCase()}`);
  if (!res.ok) {
    throw new Error(`Pokémon "${name}" not found (${res.status})`);
  }
  return res.json() as Promise<PokemonDetail>;
};
