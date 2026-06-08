export interface PokemonListItem {
  name: string;
  url: string;
}

export interface PokemonListResponse {
  count: number;
  results: PokemonListItem[];
}

export interface PokemonType {
  slot: number;
  type: {
    name: string;
    url: string;
  };
}

export interface PokemonStat {
  base_stat: number;
  stat: { name: string };
}

export interface PokemonDetail {
  id: number;
  name: string;
  types: PokemonType[];
  height: number;
  weight: number;
  base_experience: number;
  stats: PokemonStat[];
}

export interface PokemonCard {
  name: string;
  description: string;
}
