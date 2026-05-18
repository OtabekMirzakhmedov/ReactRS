import { PokemonCard } from '../types/pokemon';

interface Props extends PokemonCard {
  onClick?: () => void;
  isSelected?: boolean;
}

export default function Card({ name, description, onClick, isSelected }: Props) {
  return (
    <div
      className={`pokemon-card${isSelected ? ' pokemon-card--selected' : ''}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
    >
      <h3>{name}</h3>
      <p>{description}</p>
    </div>
  );
}
