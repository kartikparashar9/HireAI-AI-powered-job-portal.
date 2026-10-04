const formatType = (type) => {
  if (!type) {
    return "Interview";
  }

  return type
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const formatStatus = (status) => {
  if (!status) {
    return "Scheduled";
  }

  return status
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const formatDateTime = (date) => {
  if (!date) {
    return "Not scheduled";
  }

  return new Date(date).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const InterviewCard = ({ interview, onView, onEdit, onComplete, onCancel }) => {
  if (!interview) {
    return null;
  }

  return (
    <article className="recruiter-interview-card">
      <div className="recruiter-interview-card-header">
        <div className="recruiter-candidate-info">
          <div className="recruiter-candidate-avatar">
            {interview.candidate?.avatar ? (
              <img
                src={interview.candidate.avatar}
                alt={interview.candidate.name || "Candidate"}
              />
            ) : (
              <span>
                {(interview.candidate?.name || "C").charAt(0).toUpperCase()}
              </span>
            )}
          </div>

          <div>
            <h3>{interview.candidate?.name || "Candidate"}</h3>

            <p>{interview.candidate?.email || "Email unavailable"}</p>
          </div>
        </div>

        <span
          className={`recruiter-interview-status recruiter-interview-status-${(
            interview.status || "SCHEDULED"
          ).toLowerCase()}`}
        >
          {formatStatus(interview.status || "SCHEDULED")}
        </span>
      </div>

      <div className="recruiter-interview-job">
        <span>Position</span>

        <strong>{interview.job?.title || "Job Position"}</strong>
      </div>

      <div className="recruiter-interview-meta">
        <div>
          <span>Type</span>

          <strong>{formatType(interview.type)}</strong>
        </div>

        <div>
          <span>Scheduled</span>

          <strong>{formatDateTime(interview.scheduledAt)}</strong>
        </div>

        <div>
          <span>Duration</span>

          <strong>{interview.durationMinutes || 30} minutes</strong>
        </div>
      </div>

      {interview.meetingLink && (
        <div className="recruiter-interview-link">
          <span>Meeting Link</span>

          <a href={interview.meetingLink} target="_blank" rel="noreferrer">
            Join Meeting
          </a>
        </div>
      )}

      {interview.location && (
        <div className="recruiter-interview-link">
          <span>Location</span>

          <strong>{interview.location}</strong>
        </div>
      )}

      {interview.notes && (
        <div className="recruiter-interview-notes">
          <span>Notes</span>

          <p>{interview.notes}</p>
        </div>
      )}

      <div className="recruiter-interview-actions">
        <button
          type="button"
          className="recruiter-view-button"
          onClick={() => onView(interview)}
        >
          View
        </button>

        <button
          type="button"
          className="recruiter-edit-button"
          onClick={() => onEdit(interview)}
        >
          Edit
        </button>

        <button
          type="button"
          className="recruiter-complete-button"
          onClick={() => onComplete(interview)}
        >
          Complete
        </button>

        <button
          type="button"
          className="recruiter-delete-button"
          onClick={() => onCancel(interview)}
        >
          Cancel
        </button>
      </div>
    </article>
  );
};

export default InterviewCard;
