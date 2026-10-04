const JobEmptyState = () => {
  return (
    <div className="jobs-empty-state">
      <div className="jobs-empty-icon">
        <svg
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-4-4" />
        </svg>
      </div>

      <h3>No jobs found</h3>

      <p>Try changing your search or removing some filters.</p>
    </div>
  );
};

export default JobEmptyState;