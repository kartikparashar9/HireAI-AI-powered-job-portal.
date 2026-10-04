import { useNavigate } from "react-router-dom";

const formatDate = (date) => {
  if (!date) return "—";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "—";
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const RecentJobs = ({ jobs = [] }) => {
  const navigate = useNavigate();

  const safeJobs = Array.isArray(jobs) ? jobs : [];

  const recentJobs = [...safeJobs]
    .sort((a, b) => new Date(b?.createdAt || 0) - new Date(a?.createdAt || 0))
    .slice(0, 5);

  return (
    <div className="recruiter-dashboard-card">
      <div className="recruiter-dashboard-card-header">
        <div>
          <h2>Recent Jobs</h2>
          <p>Your latest job postings</p>
        </div>

        <button
          type="button"
          className="recruiter-text-button"
          onClick={() => navigate("/recruiter/jobs")}
        >
          View all
        </button>
      </div>

      {recentJobs.length === 0 ? (
        <div className="recruiter-dashboard-empty">
          <span>💼</span>
          <p>No jobs created yet.</p>

          <button
            type="button"
            className="recruiter-primary-button recruiter-small-button"
            onClick={() => navigate("/recruiter/jobs")}
          >
            Create Job
          </button>
        </div>
      ) : (
        <div className="recruiter-recent-list">
          {recentJobs.map((job) => (
            <button
              type="button"
              className="recruiter-recent-job"
              key={job._id}
              onClick={() => navigate(`/recruiter/jobs/${job._id}`)}
            >
              <div className="recruiter-recent-job-main">
                <strong>{job.title || "Untitled Job"}</strong>

                <span>{job.location || "Location not specified"}</span>
              </div>

              <div className="recruiter-recent-job-meta">
                <span
                  className={`recruiter-job-status recruiter-job-status-${String(
                    job.status || "",
                  ).toLowerCase()}`}
                >
                  {job.status || "UNKNOWN"}
                </span>

                <small>{formatDate(job.createdAt)}</small>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentJobs;
