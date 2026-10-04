import { useNavigate } from "react-router-dom";

const formatInterviewDate = (date) => {
  if (!date) return "Date not available";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Date not available";
  }

  return parsedDate.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const UpcomingInterviews = ({ interviews = [] }) => {
  const navigate = useNavigate();

  const now = new Date();

  const upcomingInterviews = (Array.isArray(interviews) ? interviews : [])
    .filter((interview) => {
      const scheduledAt = new Date(interview?.scheduledAt);

      return (
        interview?.status === "SCHEDULED" &&
        !Number.isNaN(scheduledAt.getTime()) &&
        scheduledAt >= now
      );
    })
    .sort((a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt))
    .slice(0, 5);

  return (
    <div className="recruiter-dashboard-card">
      <div className="recruiter-dashboard-card-header">
        <div>
          <h2>Upcoming Interviews</h2>
          <p>Next candidate interviews</p>
        </div>

        <button
          type="button"
          className="recruiter-text-button"
          onClick={() => navigate("/recruiter/interviews")}
        >
          View all
        </button>
      </div>

      {upcomingInterviews.length === 0 ? (
        <div className="recruiter-dashboard-empty">
          <span>📅</span>
          <p>No upcoming interviews.</p>

          <button
            type="button"
            className="recruiter-primary-button recruiter-small-button"
            onClick={() => navigate("/recruiter/interviews")}
          >
            Schedule Interview
          </button>
        </div>
      ) : (
        <div className="recruiter-interview-dashboard-list">
          {upcomingInterviews.map((interview) => (
            <button
              type="button"
              className="recruiter-dashboard-interview"
              key={interview._id}
              onClick={() =>
                navigate(`/recruiter/interviews/${interview._id}`, {
                  state: { interview },
                })
              }
            >
              <div className="recruiter-dashboard-interview-date">
                <span>
                  {new Date(interview.scheduledAt).toLocaleDateString("en-IN", {
                    day: "2-digit",
                  })}
                </span>

                <small>
                  {new Date(interview.scheduledAt).toLocaleDateString("en-IN", {
                    month: "short",
                  })}
                </small>
              </div>

              <div className="recruiter-dashboard-interview-info">
                <strong>{interview?.candidate?.name || "Candidate"}</strong>

                <span>{interview?.job?.title || "Interview"}</span>

                <small>{formatInterviewDate(interview.scheduledAt)}</small>
              </div>

              <div className="recruiter-dashboard-interview-type">
                {interview.type || "Interview"}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default UpcomingInterviews;
