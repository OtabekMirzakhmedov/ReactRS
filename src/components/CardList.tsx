import { useNavigate, useSearchParams } from 'react-router-dom';
import Card from './Card';
import { PokemonCard } from '../types/pokemon';
import { useSelectionStore } from '../store/selectionStore';

interface Props {
  pokemons: PokemonCard[];
}

export default function CardList({ pokemons }: Props) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const selectedName = searchParams.get('details');
  const { selectedItems, toggleItem } = useSelectionStore();

  const handleCardClick = (name: string) => {
    const lowerName = name.toLowerCase();
    const params = new URLSearchParams(searchParams);
    if (selectedName === lowerName) {
      params.delete('details');
    } else {
      params.set('details', lowerName);
    }
    navigate(`?${params.toString()}`);
  };

  if (pokemons.length === 0) {
    return <p className="no-results">No Pokémon found.</p>;
  }

  return (
    <div className="card-list">
      {pokemons.map((pokemon) => (
        <Card
          key={pokemon.name}
          name={pokemon.name}
          description={pokemon.description}
          onClick={() => handleCardClick(pokemon.name)}
          isSelected={selectedName === pokemon.name.toLowerCase()}
          isChecked={selectedItems.has(pokemon.name)}
          onCheckboxChange={toggleItem}
        />
      ))}
    </div>
  );
}
