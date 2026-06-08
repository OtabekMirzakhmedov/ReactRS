import { create } from 'zustand';

interface SelectionState {
  selectedItems: Set<string>;
  toggleItem: (name: string) => void;
  clearAll: () => void;
}

export const useSelectionStore = create<SelectionState>((set) => ({
  selectedItems: new Set<string>(),
  toggleItem: (name: string) =>
    set((state) => {
      const next = new Set(state.selectedItems);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return { selectedItems: next };
    }),
  clearAll: () => set({ selectedItems: new Set() }),
}));
