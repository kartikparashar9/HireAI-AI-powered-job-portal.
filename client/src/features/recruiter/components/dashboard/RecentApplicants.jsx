const formatDate = (date) => {
  if (!date) return "—";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "—";
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
  });
};

const getInitial = (name) => {
  return name?.trim()?.charAt(0)?.toUpperCase() || "C";
};

const RecentApplicants = ({ applications = [] }) => {
  const safeApplications = Array.isArray(applications) ? applications : [];

  const recentApplicants = [...safeApplications]
    .sort(
      (a, b) =>
        new Date(b?.appliedAt || b?.createdAt || 0) -
        new Date(a?.appliedAt || a?.createdAt || 0),
    )
    .slice(0, 6);

  return (
    <div className="recruiter-dashboard-card">
      <div className="recruiter-dashboard-card-header">
        <div>
          <h2>Recent Applicants</h2>
          <p>Latest candidates who applied</p>
        </div>

        <span className="recruiter-dashboard-count">
          {safeApplications.length}
        </span>
      </div>

      {recentApplicants.length === 0 ? (
        <div className="recruiter-dashboard-empty">
          <span>👤</span>
          <p>No applicants yet.</p>
        </div>
      ) : (
        <div className="recruiter-applicant-list">
          {recentApplicants.map((application) => {
            const candidate = application?.candidate;

            const candidateName = candidate?.name || "Candidate";

            const status = application?.status || "PENDING";

            return (
              <div className="recruiter-applicant-row" key={application._id}>
                <div className="recruiter-applicant-avatar">
                  {candidate?.avatar ? (
                    <img src={candidate.avatar} alt={candidateName} />
                  ) : (
                    getInitial(candidateName)
                  )}
                </div>

                <div className="recruiter-applicant-info">
                  <strong>{candidateName}</strong>

                  <span>{application?.job?.title || "Job application"}</span>
                </div>

                <div className="recruiter-applicant-meta">
                  <span
                    className={`recruiter-application-status recruiter-application-status-${String(
                      status,
                    ).toLowerCase()}`}
                  >
                    {status}
                  </span>

                  <small>
                    {formatDate(
                      application?.appliedAt || application?.createdAt,
                    )}
                  </small>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RecentApplicants;
