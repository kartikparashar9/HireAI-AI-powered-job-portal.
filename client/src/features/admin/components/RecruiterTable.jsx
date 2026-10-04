import StatusBadge from "./StatusBadge";

const formatDate = (value) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const RecruiterTable = ({
  recruiters = [],
  pendingOnly = false,
  actionLoadingId,
  onApprove,
  onReject,
}) => {
  if (!recruiters.length) {
    return (
      <div className="admin-empty-state">
        <h3>No recruiters found</h3>
        <p>There are no recruiters matching the current view.</p>
      </div>
    );
  }

  return (
    <div className="admin-table-wrapper">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Recruiter</th>
            <th>Status</th>
            <th>Email Verification</th>
            <th>Account</th>
            <th>Created</th>

            {pendingOnly && <th>Actions</th>}
          </tr>
        </thead>

        <tbody>
          {recruiters.map((recruiter) => {
            const loading = actionLoadingId === recruiter._id;

            return (
              <tr key={recruiter._id}>
                <td>
                  <div className="admin-user-cell">
                    {recruiter.avatar ? (
                      <img
                        src={recruiter.avatar}
                        alt=""
                        className="admin-avatar"
                      />
                    ) : (
                      <div className="admin-avatar admin-avatar-fallback">
                        {(recruiter.name || "R").charAt(0).toUpperCase()}
                      </div>
                    )}

                    <div>
                      <strong>{recruiter.name || "Unnamed Recruiter"}</strong>

                      <span>{recruiter.email}</span>
                    </div>
                  </div>
                </td>

                <td>
                  <StatusBadge status={recruiter.recruiterStatus} />
                </td>

                <td>
                  <StatusBadge
                    status={
                      recruiter.isEmailVerified ? "VERIFIED" : "UNVERIFIED"
                    }
                  />
                </td>

                <td>
                  <StatusBadge active={recruiter.isActive} />
                </td>

                <td>{formatDate(recruiter.createdAt)}</td>

                {pendingOnly && (
                  <td>
                    <div className="admin-table-actions">
                      <button
                        type="button"
                        className="admin-small-button"
                        disabled={loading}
                        onClick={() => onApprove(recruiter)}
                      >
                        {loading ? "..." : "Approve"}
                      </button>

                      <button
                        type="button"
                        className="admin-small-danger-button"
                        disabled={loading}
                        onClick={() => onReject(recruiter)}
                      >
                        {loading ? "..." : "Reject"}
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default RecruiterTable;
