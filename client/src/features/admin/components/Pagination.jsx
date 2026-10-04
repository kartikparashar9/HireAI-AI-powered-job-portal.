const Pagination = ({
  page = 1,
  totalPages = 1,
  onPageChange,
  disabled = false,
}) => {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="admin-pagination">
      <button
        type="button"
        className="admin-secondary-button"
        disabled={disabled || page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        Previous
      </button>

      <span>
        Page <strong>{page}</strong> of <strong>{totalPages}</strong>
      </span>

      <button
        type="button"
        className="admin-secondary-button"
        disabled={disabled || page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
