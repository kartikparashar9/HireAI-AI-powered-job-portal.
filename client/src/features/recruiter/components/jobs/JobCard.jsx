const formatJobType = (value) => {
  if (!value) {
    return "—";
  }

  return value
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const formatSalary = (min, max) => {
  if (!min && !max) {
    return "Not disclosed";
  }

  const format = (value) =>
    new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: 0,
    }).format(value);

  if (min && max) {
    return `₹${format(min)} - ₹${format(max)}`;
  }

  if (min) {
    return `₹${format(min)}+`;
  }

  return `Up to ₹${format(max)}`;
};

const formatExperience = (min, max) => {
  if (min === undefined && max === undefined) {
    return "Not specified";
  }

  if (min !== undefined && max !== undefined && min !== null && max !== null) {
    return `${min} - ${max} years`;
  }

  if (min !== undefined && min !== null) {
    return `${min}+ years`;
  }

  return `Up to ${max} years`;
};

const formatDeadline = (date) => {
  if (!date) {
    return "No deadline";
  }

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const JobCard = ({ job, onEdit, onDelete, onView, isSubmitting }) => {
  if (!job) {
    return null;
  }

  const status = job.status || "OPEN";

  return (
    <article className="recruiter-job-card">
      <div className="recruiter-job-card-header">
        <div>
          <div className="recruiter-job-title-row">
            <h2>{job.title || "Untitled Job"}</h2>

            <span
              className={`recruiter-job-status recruiter-job-status-${status.toLowerCase()}`}
            >
              {formatJobType(status)}
            </span>
          </div>

          <p className="recruiter-job-location">
            {job.location || "Location not specified"}
          </p>
        </div>

        <div className="recruiter-job-card-actions">
          <button
            type="button"
            className="recruiter-view-button"
            onClick={() => onView(job)}
          >
            View
          </button>

          <button
            type="button"
            className="recruiter-edit-button"
            onClick={() => onEdit(job)}
            disabled={isSubmitting}
          >
            Edit
          </button>

          <button
            type="button"
            className="recruiter-delete-button"
            onClick={() => onDelete(job)}
            disabled={isSubmitting}
          >
            Delete
          </button>
        </div>
      </div>

      {job.description && (
        <p className="recruiter-job-description">{job.description}</p>
      )}

      <div className="recruiter-job-meta">
        <div>
          <span>Job Type</span>
          <strong>{formatJobType(job.jobType)}</strong>
        </div>

        <div>
          <span>Work Mode</span>
          <strong>{formatJobType(job.workMode)}</strong>
        </div>

        <div>
          <span>Experience</span>
          <strong>
            {formatExperience(job.experienceMin, job.experienceMax)}
          </strong>
        </div>

        <div>
          <span>Salary</span>
          <strong>{formatSalary(job.salaryMin, job.salaryMax)}</strong>
        </div>

        <div>
          <span>Deadline</span>
          <strong>{formatDeadline(job.applicationDeadline)}</strong>
        </div>
      </div>

      {Array.isArray(job.skills) && job.skills.length > 0 && (
        <div className="recruiter-job-skills">
          {job.skills.map((skill) => (
            <span key={skill}>{skill}</span>
          ))}
        </div>
      )}
    </article>
  );
};

export default JobCard;
