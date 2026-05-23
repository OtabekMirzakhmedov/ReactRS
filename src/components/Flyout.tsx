import { useSelectionStore } from '../store/selectionStore';

export default function Flyout() {
  const { selectedItems, clearAll } = useSelectionStore();
  const count = selectedItems.size;

  if (count === 0) return null;

  return (
    <div className="flyout">
      <span className="flyout-count">
        {count} item{count !== 1 ? 's' : ''} selected
      </span>
      <div className="flyout-actions">
        <button onClick={clearAll}>Unselect all</button>
        <button>Download</button>
      </div>
    </div>
  );
}
