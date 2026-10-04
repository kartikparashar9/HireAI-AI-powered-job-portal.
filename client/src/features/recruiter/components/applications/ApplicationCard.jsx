const formatStatus = (status) => {
  if (!status) {
    return "Unknown";
  }

  return status
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const formatDate = (date) => {
  if (!date) {
    return "—";
  }

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const ApplicationCard = ({ application, onView, onStatusChange }) => {
  if (!application) {
    return null;
  }

  const candidate = application.candidate;
  const job = application.job;

  return (
    <article className="recruiter-application-card">
      <div className="recruiter-application-header">
        <div className="recruiter-candidate-info">
          <div className="recruiter-candidate-avatar">
            {candidate?.avatar ? (
              <img src={candidate.avatar} alt={candidate.name || "Candidate"} />
            ) : (
              <span>{(candidate?.name || "C").charAt(0).toUpperCase()}</span>
            )}
          </div>

          <div>
            <h3>{candidate?.name || "Unknown Candidate"}</h3>

            <p>{candidate?.email || "Email unavailable"}</p>
          </div>
        </div>

        <span
          className={`recruiter-application-status recruiter-application-status-${(
            application.status || "PENDING"
          ).toLowerCase()}`}
        >
          {formatStatus(application.status || "PENDING")}
        </span>
      </div>

      {job && (
        <div className="recruiter-application-job">
          <span>Applied For</span>

          <strong>{job.title || "Job"}</strong>
        </div>
      )}

      <div className="recruiter-application-meta">
        <div>
          <span>Applied On</span>
          <strong>{formatDate(application.appliedAt)}</strong>
        </div>

        <div>
          <span>Last Updated</span>
          <strong>{formatDate(application.statusUpdatedAt)}</strong>
        </div>
      </div>

      {application.coverLetter && (
        <div className="recruiter-application-cover-letter">
          <span>Cover Letter</span>

          <p>
            {application.coverLetter.length > 220
              ? `${application.coverLetter.slice(0, 220)}...`
              : application.coverLetter}
          </p>
        </div>
      )}

      <div className="recruiter-application-actions">
        <button
          type="button"
          className="recruiter-view-button"
          onClick={() => onView(application)}
        >
          View Details
        </button>

        <button
          type="button"
          className="recruiter-primary-button"
          onClick={() => onStatusChange(application)}
        >
          Update Status
        </button>
      </div>
    </article>
  );
};

export default ApplicationCard;
