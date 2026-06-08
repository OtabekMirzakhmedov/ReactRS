import { PokemonCard } from '../types/pokemon';

interface Props extends PokemonCard {
  onClick?: () => void;
  isSelected?: boolean;
  isChecked?: boolean;
  onCheckboxChange?: (name: string) => void;
}

export default function Card({ name, description, onClick, isSelected, isChecked, onCheckboxChange }: Props) {
  return (
    <div
      className={`pokemon-card${isSelected ? ' pokemon-card--selected' : ''}${isChecked ? ' pokemon-card--checked' : ''}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
    >
      <input
        type="checkbox"
        className="pokemon-card__checkbox"
        checked={isChecked ?? false}
        onChange={() => onCheckboxChange?.(name)}
        onClick={(e) => e.stopPropagation()}
        aria-label={`Select ${name}`}
      />
      <h3>{name}</h3>
      <p>{description}</p>
    </div>
  );
}
