import { ChangeEvent, useState } from 'react';

interface Props {
  initialValue: string;
  onSearch: (term: string) => void;
}

export default function Search({ initialValue, onSearch }: Props) {
  const [inputValue, setInputValue] = useState(initialValue);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSearch = () => {
    onSearch(inputValue.trim());
  };

  return (
    <div className="search">
      <input value={inputValue} onChange={handleChange} placeholder="Search Pokémon..." />
      <button onClick={handleSearch}>Search</button>
    </div>
  );
}
