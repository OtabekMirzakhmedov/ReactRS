import { Component } from 'react';
import { PokemonCard } from '../types/pokemon';

export default class Card extends Component<PokemonCard> {
  render() {
    console.log("pokemoncard"+this)
    const { name, description } = this.props;
    return (
      <div className="pokemon-card">
        <h3>{name}</h3>
        <p>{description}</p>
      </div>
    );
  }
}
