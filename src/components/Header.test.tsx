import { render, screen } from '@testing-library/react';
import Header from './Header';

describe('Header', () => {
  it('renders the app title', () => {
    render(<Header />);
    expect(screen.getByText('Pokédex Search')).toBeInTheDocument();
  });

  it('renders a header element', () => {
    render(<Header />);
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });
});
