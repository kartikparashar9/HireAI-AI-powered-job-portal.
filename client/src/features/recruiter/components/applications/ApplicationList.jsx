import ApplicationCard from "./ApplicationCard";

const ApplicationList = ({ applications, onView, onStatusChange }) => {
  if (!applications || applications.length === 0) {
    return (
      <div className="recruiter-empty-state">
        <div className="recruiter-empty-icon">📄</div>

        <h3>No applications yet</h3>

        <p>Applications for this job will appear here once candidates apply.</p>
      </div>
    );
  }

  return (
    <div className="recruiter-application-list">
      {applications.map((application) => (
        <ApplicationCard
          key={application._id}
          application={application}
          onView={onView}
          onStatusChange={onStatusChange}
        />
      ))}
    </div>
  );
};

export default ApplicationList;
