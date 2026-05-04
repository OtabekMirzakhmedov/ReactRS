import { Component } from 'react';
import Card from './Card';
import { PokemonCard } from '../types/pokemon';

interface Props {
  pokemons: PokemonCard[];
}

export default class CardList extends Component<Props> {
  render() {
    const { pokemons } = this.props;
    if (pokemons.length === 0) {
      return <p className="no-results">No Pokémon found.</p>;
    }
    return (
      <div className="card-list">
        {pokemons.map((pokemon) => (
          <Card key={pokemon.name} name={pokemon.name} description={pokemon.description} />
        ))}
      </div>
    );
  }
}
