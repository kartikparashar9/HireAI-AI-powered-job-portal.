const JobPagination = ({ pagination, onPageChange }) => {
  const {
    page = 1,
    totalPages = 1,
    hasPreviousPage = false,
    hasNextPage = false,
  } = pagination;

  if (totalPages <= 1) {
    return null;
  }

  const pages = [];

  const start = Math.max(1, page - 2);

  const end = Math.min(totalPages, page + 2);

  for (let current = start; current <= end; current++) {
    pages.push(current);
  }

  return (
    <div className="jobs-pagination">
      <button
        type="button"
        disabled={!hasPreviousPage}
        onClick={() => onPageChange(page - 1)}
      >
        ←
      </button>

      {start > 1 && (
        <>
          <button type="button" onClick={() => onPageChange(1)}>
            1
          </button>

          {start > 2 && <span>...</span>}
        </>
      )}

      {pages.map((currentPage) => (
        <button
          type="button"
          key={currentPage}
          className={currentPage === page ? "active" : ""}
          onClick={() => onPageChange(currentPage)}
        >
          {currentPage}
        </button>
      ))}

      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span>...</span>}

          <button type="button" onClick={() => onPageChange(totalPages)}>
            {totalPages}
          </button>
        </>
      )}

      <button
        type="button"
        disabled={!hasNextPage}
        onClick={() => onPageChange(page + 1)}
      >
        →
      </button>
    </div>
  );
};

export default JobPagination;
