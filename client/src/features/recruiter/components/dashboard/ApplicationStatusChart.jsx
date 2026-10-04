const STATUS_CONFIG = [
  {
    key: "PENDING",
    label: "Pending",
  },
  {
    key: "REVIEWING",
    label: "Reviewing",
  },
  {
    key: "SHORTLISTED",
    label: "Shortlisted",
  },
  {
    key: "ACCEPTED",
    label: "Accepted",
  },
  {
    key: "REJECTED",
    label: "Rejected",
  },
];

const ApplicationStatusChart = ({ applications = [] }) => {
  const safeApplications = Array.isArray(applications) ? applications : [];

  const normalizedApplications = safeApplications.map((application) =>
    String(application?.status || "").toUpperCase(),
  );

  const counts = STATUS_CONFIG.map((status) => ({
    ...status,
    count: normalizedApplications.filter((item) => item === status.key).length,
  }));

  const total = safeApplications.length;

  const maxCount = Math.max(...counts.map((item) => item.count), 1);

  return (
    <div className="recruiter-dashboard-card recruiter-application-chart">
      <div className="recruiter-dashboard-card-header">
        <div>
          <h2>Application Overview</h2>
          <p>Current application pipeline</p>
        </div>

        <strong className="recruiter-chart-total">{total}</strong>
      </div>

      <div className="recruiter-chart-list">
        {counts.map((item) => {
          const width =
            item.count === 0 ? 0 : Math.max((item.count / maxCount) * 100, 8);

          return (
            <div className="recruiter-chart-row" key={item.key}>
              <div className="recruiter-chart-label">
                <span>{item.label}</span>
                <strong>{item.count}</strong>
              </div>

              <div className="recruiter-chart-track">
                <div
                  className={`recruiter-chart-bar recruiter-chart-bar-${item.key.toLowerCase()}`}
                  style={{
                    width: `${width}%`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ApplicationStatusChart;
