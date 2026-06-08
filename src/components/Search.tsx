import { ChangeEvent, FormEvent, useState } from 'react';

interface Props {
  initialValue: string;
  onSearch: (term: string) => void;
}

export default function Search({ initialValue, onSearch }: Props) {
  const [inputValue, setInputValue] = useState(initialValue);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch(inputValue.trim());
  };

  return (
    <form className="search" onSubmit={handleSubmit}>
      <input value={inputValue} onChange={handleChange} placeholder="Search Pokémon..." />
      <button type="submit">Search</button>
    </form>
  );
}
