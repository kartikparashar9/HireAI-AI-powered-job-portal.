import JobCard from "./JobCard";

const JobList = ({ jobs, onEdit, onDelete, onView, isSubmitting }) => {
  if (!jobs || jobs.length === 0) {
    return (
      <div className="recruiter-empty-state">
        <div className="recruiter-empty-icon">💼</div>

        <h3>No jobs posted yet</h3>

        <p>Create your first job posting to start receiving applications.</p>
      </div>
    );
  }

  return (
    <div className="recruiter-job-list">
      {jobs.map((job) => (
        <JobCard
          key={job._id}
          job={job}
          onEdit={onEdit}
          onDelete={onDelete}
          onView={onView}
          isSubmitting={isSubmitting}
        />
      ))}
    </div>
  );
};

export default JobList;
