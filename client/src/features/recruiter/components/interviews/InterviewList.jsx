import InterviewCard from "./InterviewCard";

const InterviewList = ({
  interviews,
  onView,
  onEdit,
  onComplete,
  onCancel,
}) => {
  if (!interviews || interviews.length === 0) {
    return (
      <div className="recruiter-empty-state">
        <div className="recruiter-empty-icon">📅</div>

        <h3>No interviews found</h3>

        <p>Scheduled interviews will appear here.</p>
      </div>
    );
  }

  return (
    <div className="recruiter-interview-list">
      {interviews.map((interview) => (
        <InterviewCard
          key={interview._id}
          interview={interview}
          onView={onView}
          onEdit={onEdit}
          onComplete={onComplete}
          onCancel={onCancel}
        />
      ))}
    </div>
  );
};

export default InterviewList;
