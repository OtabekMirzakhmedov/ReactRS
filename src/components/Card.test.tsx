import { render, screen, fireEvent } from '@testing-library/react';
import Card from './Card';

describe('Card', () => {
  it('renders pokemon name', () => {
    render(<Card name="Pikachu" description="Types: electric" />);
    expect(screen.getByText('Pikachu')).toBeInTheDocument();
  });

  it('renders pokemon description', () => {
    render(<Card name="Pikachu" description="Types: electric" />);
    expect(screen.getByText('Types: electric')).toBeInTheDocument();
  });

  it('renders name inside a heading', () => {
    render(<Card name="Bulbasaur" description="Types: grass, poison" />);
    expect(screen.getByRole('heading', { name: 'Bulbasaur' })).toBeInTheDocument();
  });

  it('renders a checkbox', () => {
    render(<Card name="Pikachu" description="Types: electric" />);
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  it('checkbox is unchecked by default', () => {
    render(<Card name="Pikachu" description="Types: electric" />);
    expect(screen.getByRole('checkbox')).not.toBeChecked();
  });

  it('checkbox is checked when isChecked is true', () => {
    render(<Card name="Pikachu" description="Types: electric" isChecked={true} />);
    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('calls onCheckboxChange with pokemon name when checkbox changes', () => {
    const onCheckboxChange = vi.fn();
    render(
      <Card name="Pikachu" description="Types: electric" onCheckboxChange={onCheckboxChange} />
    );
    fireEvent.click(screen.getByRole('checkbox'));
    expect(onCheckboxChange).toHaveBeenCalledWith('Pikachu');
  });

  it('checkbox click does not trigger card onClick', () => {
    const onClick = vi.fn();
    const onCheckboxChange = vi.fn();
    render(
      <Card
        name="Pikachu"
        description="Types: electric"
        onClick={onClick}
        onCheckboxChange={onCheckboxChange}
      />
    );
    fireEvent.click(screen.getByRole('checkbox'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('applies pokemon-card--selected class when isSelected is true', () => {
    const { container } = render(
      <Card name="Pikachu" description="Types: electric" isSelected={true} />
    );
    expect(container.firstChild).toHaveClass('pokemon-card--selected');
  });

  it('applies pokemon-card--checked class when isChecked is true', () => {
    const { container } = render(
      <Card name="Pikachu" description="Types: electric" isChecked={true} />
    );
    expect(container.firstChild).toHaveClass('pokemon-card--checked');
  });

  it('calls onClick when card is clicked', () => {
    const onClick = vi.fn();
    render(<Card name="Pikachu" description="Types: electric" onClick={onClick} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('calls onClick when Enter is pressed on card', () => {
    const onClick = vi.fn();
    render(<Card name="Pikachu" description="Types: electric" onClick={onClick} />);
    fireEvent.keyDown(screen.getByRole('button'), { key: 'Enter' });
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when non-Enter key is pressed', () => {
    const onClick = vi.fn();
    render(<Card name="Pikachu" description="Types: electric" onClick={onClick} />);
    fireEvent.keyDown(screen.getByRole('button'), { key: 'Space' });
    expect(onClick).not.toHaveBeenCalled();
  });
});
