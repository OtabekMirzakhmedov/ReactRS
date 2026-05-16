interface Props {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ page, totalPages, onPageChange }: Props) {
  if (totalPages <= 1) return null;

  return (
    <div className="pagination">
      <button onClick={() => onPageChange(page - 1)} disabled={page <= 1}>
        &laquo; Prev
      </button>
      <span className="pagination-info">
        Page {page} of {totalPages}
      </span>
      <button onClick={() => onPageChange(page + 1)} disabled={page >= totalPages}>
        Next &raquo;
      </button>
    </div>
  );
}
