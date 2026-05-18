import { Link } from 'react-router-dom';

export default function AboutPage() {
  return (
    <div className="about-page">
      <h1>About</h1>
      <p>
        <strong>Author:</strong> Otabek Mirzakhmedov
      </p>
      <p>
        This Pokédex app was built as part of the{' '}
        <a
          href="https://rs.school/react/"
          target="_blank"
          rel="noopener noreferrer"
        >
          RS School React Course
        </a>
        .
      </p>
      <p>
        It uses the{' '}
        <a href="https://pokeapi.co/" target="_blank" rel="noopener noreferrer">
          PokéAPI
        </a>{' '}
        to display Pokémon data.
      </p>
      <Link to="/" className="back-link">
        &larr; Back to Pokédex
      </Link>
    </div>
  );
}
