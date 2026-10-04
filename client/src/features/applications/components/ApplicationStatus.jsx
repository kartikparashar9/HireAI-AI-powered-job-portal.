const statusConfig = {
  APPLIED: {
    label: "Applied",
    className: "application-status-applied",
  },
  SHORTLISTED: {
    label: "Shortlisted",
    className: "application-status-shortlisted",
  },
  REJECTED: {
    label: "Rejected",
    className: "application-status-rejected",
  },
  HIRED: {
    label: "Hired",
    className: "application-status-hired",
  },
  WITHDRAWN: {
    label: "Withdrawn",
    className: "application-status-withdrawn",
  },
};

const ApplicationStatus = ({ status }) => {
  const currentStatus = statusConfig[status] || statusConfig.APPLIED;

  return (
    <span className={`application-status ${currentStatus.className}`}>
      {currentStatus.label}
    </span>
  );
};

export default ApplicationStatus;
