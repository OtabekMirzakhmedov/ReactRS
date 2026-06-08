import { useSelectionStore } from './selectionStore';

beforeEach(() => {
  useSelectionStore.setState({ selectedItems: new Set() });
});

describe('selectionStore', () => {
  it('starts with no selected items', () => {
    const { selectedItems } = useSelectionStore.getState();
    expect(selectedItems.size).toBe(0);
  });

  it('toggleItem adds a new item', () => {
    useSelectionStore.getState().toggleItem('Pikachu');
    expect(useSelectionStore.getState().selectedItems.has('Pikachu')).toBe(true);
  });

  it('toggleItem removes an already selected item', () => {
    useSelectionStore.getState().toggleItem('Pikachu');
    useSelectionStore.getState().toggleItem('Pikachu');
    expect(useSelectionStore.getState().selectedItems.has('Pikachu')).toBe(false);
  });

  it('toggleItem can select multiple items independently', () => {
    useSelectionStore.getState().toggleItem('Pikachu');
    useSelectionStore.getState().toggleItem('Bulbasaur');
    const { selectedItems } = useSelectionStore.getState();
    expect(selectedItems.has('Pikachu')).toBe(true);
    expect(selectedItems.has('Bulbasaur')).toBe(true);
    expect(selectedItems.size).toBe(2);
  });

  it('clearAll removes all selected items', () => {
    useSelectionStore.getState().toggleItem('Pikachu');
    useSelectionStore.getState().toggleItem('Bulbasaur');
    useSelectionStore.getState().clearAll();
    expect(useSelectionStore.getState().selectedItems.size).toBe(0);
  });

  it('clearAll on empty store has no effect', () => {
    useSelectionStore.getState().clearAll();
    expect(useSelectionStore.getState().selectedItems.size).toBe(0);
  });
});
