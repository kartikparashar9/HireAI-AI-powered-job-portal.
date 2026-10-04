const statusConfig = {
  SCHEDULED: {
    label: "Scheduled",
    className: "interview-status-scheduled",
  },
  CONFIRMED: {
    label: "Confirmed",
    className: "interview-status-confirmed",
  },
  RESCHEDULED: {
    label: "Rescheduled",
    className: "interview-status-rescheduled",
  },
  COMPLETED: {
    label: "Completed",
    className: "interview-status-completed",
  },
  CANCELLED: {
    label: "Cancelled",
    className: "interview-status-cancelled",
  },
  DECLINED: {
    label: "Declined",
    className: "interview-status-declined",
  },
};

const InterviewStatus = ({ status }) => {
  const currentStatus = statusConfig[status] || statusConfig.SCHEDULED;

  return (
    <span className={`interview-status ${currentStatus.className}`}>
      {currentStatus.label}
    </span>
  );
};

export default InterviewStatus;
