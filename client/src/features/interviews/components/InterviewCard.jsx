import { useNavigate } from "react-router-dom";

import InterviewStatus from "./InterviewStatus";

const getJob = (interview) =>
  interview?.job && typeof interview.job === "object" ? interview.job : null;

const getCompany = (interview, job) => {
  if (job?.company && typeof job.company === "object") {
    return job.company;
  }

  if (interview?.company && typeof interview.company === "object") {
    return interview.company;
  }

  return null;
};

const formatDate = (date) => {
  if (!date) return "Date not available";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Date not available";
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const formatTime = (date) => {
  if (!date) return "Time not available";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Time not available";
  }

  return parsedDate.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
  });
};

const formatInterviewType = (type) => {
  if (!type) return "Interview";

  return type
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const InterviewCard = ({ interview }) => {
  const navigate = useNavigate();

  const job = getJob(interview);
  const company = getCompany(interview, job);

  const interviewId = interview?._id;

  const jobTitle = job?.title || interview?.jobTitle || "Interview";

  const companyName = company?.name || interview?.companyName || "Company";

  const location =
    job?.location || interview?.location || "Location not specified";

  const handleView = () => {
    if (!interviewId) return;

    navigate(`/jobseeker/interviews/${interviewId}`);
  };

  return (
    <article className="interview-card">
      <div className="interview-card-top">
        <div className="interview-company-logo">
          {company?.logo ? (
            <img src={company.logo} alt={companyName} />
          ) : (
            companyName.charAt(0).toUpperCase()
          )}
        </div>

        <div className="interview-card-heading">
          <h3>{jobTitle}</h3>
          <p>{companyName}</p>
        </div>

        <InterviewStatus status={interview?.status} />
      </div>

      <div className="interview-card-info">
        <div className="interview-info-item">
          <span className="interview-info-label">Date</span>
          <strong>{formatDate(interview?.scheduledAt)}</strong>
        </div>

        <div className="interview-info-item">
          <span className="interview-info-label">Time</span>
          <strong>{formatTime(interview?.scheduledAt)}</strong>
        </div>

        <div className="interview-info-item">
          <span className="interview-info-label">Type</span>
          <strong>{formatInterviewType(interview?.type)}</strong>
        </div>

        <div className="interview-info-item">
          <span className="interview-info-label">Location</span>
          <strong>{location}</strong>
        </div>
      </div>

      <div className="interview-card-bottom">
        <span className="interview-duration">
          {interview?.durationMinutes
            ? `${interview.durationMinutes} minutes`
            : "Duration not specified"}
        </span>

        <button
          type="button"
          className="interview-view-button"
          onClick={handleView}
        >
          View Details
        </button>
      </div>
    </article>
  );
};

export default InterviewCard;
