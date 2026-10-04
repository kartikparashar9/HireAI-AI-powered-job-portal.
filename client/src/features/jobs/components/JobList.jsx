import JobCard from "./JobCard";
import JobEmptyState from "./JobEmptyState";

const JobList = ({ jobs, isLoading }) => {
  if (isLoading) {
    return (
      <div className="jobs-list">
        {[1, 2, 3, 4].map((item) => (
          <div className="job-card-skeleton" key={item}>
            <div className="skeleton-logo" />

            <div className="skeleton-line large" />
            <div className="skeleton-line" />
            <div className="skeleton-line small" />

            <div className="skeleton-tags" />
          </div>
        ))}
      </div>
    );
  }

  if (!jobs.length) {
    return <JobEmptyState />;
  }

  return (
    <div className="jobs-list">
      {jobs.map((job) => (
        <JobCard key={job._id} job={job} />
      ))}
    </div>
  );
};

export default JobList;