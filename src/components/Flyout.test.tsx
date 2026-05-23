import { render, screen, fireEvent } from '@testing-library/react';
import Flyout from './Flyout';
import { useSelectionStore } from '../store/selectionStore';

beforeEach(() => {
  useSelectionStore.setState({ selectedItems: new Set() });
});

describe('Flyout', () => {
  it('renders nothing when no items are selected', () => {
    const { container } = render(<Flyout />);
    expect(container.firstChild).toBeNull();
  });

  it('renders when items are selected', () => {
    useSelectionStore.setState({ selectedItems: new Set(['Pikachu']) });
    render(<Flyout />);
    expect(screen.getByText(/selected/i)).toBeInTheDocument();
  });

  it('shows singular "item" for one selection', () => {
    useSelectionStore.setState({ selectedItems: new Set(['Pikachu']) });
    render(<Flyout />);
    expect(screen.getByText('1 item selected')).toBeInTheDocument();
  });

  it('shows plural "items" for multiple selections', () => {
    useSelectionStore.setState({ selectedItems: new Set(['Pikachu', 'Bulbasaur']) });
    render(<Flyout />);
    expect(screen.getByText('2 items selected')).toBeInTheDocument();
  });

  it('renders "Unselect all" button', () => {
    useSelectionStore.setState({ selectedItems: new Set(['Pikachu']) });
    render(<Flyout />);
    expect(screen.getByRole('button', { name: 'Unselect all' })).toBeInTheDocument();
  });

  it('renders "Download" button', () => {
    useSelectionStore.setState({ selectedItems: new Set(['Pikachu']) });
    render(<Flyout />);
    expect(screen.getByRole('button', { name: 'Download' })).toBeInTheDocument();
  });

  it('"Unselect all" clears all selected items', () => {
    useSelectionStore.setState({ selectedItems: new Set(['Pikachu', 'Bulbasaur']) });
    render(<Flyout />);
    fireEvent.click(screen.getByRole('button', { name: 'Unselect all' }));
    expect(useSelectionStore.getState().selectedItems.size).toBe(0);
  });

  it('disappears after all items are unselected', () => {
    useSelectionStore.setState({ selectedItems: new Set(['Pikachu']) });
    const { container } = render(<Flyout />);
    fireEvent.click(screen.getByRole('button', { name: 'Unselect all' }));
    expect(container.firstChild).toBeNull();
  });
});
