import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="header">
      <h1>Pokédex Search</h1>
      <nav className="main-nav">
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
      </nav>
    </header>
  );
}
