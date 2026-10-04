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

const formatRole = (role) => {
  if (!role) return "—";

  return role
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const UserTable = ({
  users = [],
  currentAdminId,
  actionLoadingId,
  onToggleStatus,
  onDelete,
  onView,
}) => {
  if (!users.length) {
    return (
      <div className="admin-empty-state">
        <h3>No users found</h3>
        <p>Try changing your search or filters.</p>
      </div>
    );
  }

  return (
    <div className="admin-table-wrapper">
      <table className="admin-table">
        <thead>
          <tr>
            <th>User</th>
            <th>Role</th>
            <th>Email</th>
            <th>Status</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => {
            const isSelf = String(user._id) === String(currentAdminId);

            const loading = actionLoadingId === user._id;

            return (
              <tr key={user._id}>
                <td>
                  <div className="admin-user-cell">
                    {user.avatar ? (
                      <img src={user.avatar} alt="" className="admin-avatar" />
                    ) : (
                      <div className="admin-avatar admin-avatar-fallback">
                        {(user.name || "U").charAt(0).toUpperCase()}
                      </div>
                    )}

                    <div>
                      <strong>{user.name || "Unnamed User"}</strong>

                      <span>{user.email}</span>
                    </div>
                  </div>
                </td>

                <td>{formatRole(user.role)}</td>

                <td>
                  <StatusBadge
                    status={user.isEmailVerified ? "VERIFIED" : "UNVERIFIED"}
                  />
                </td>

                <td>
                  <StatusBadge active={user.isActive} />
                </td>

                <td>{formatDate(user.createdAt)}</td>

                <td>
                  <div className="admin-table-actions">
                    <button
                      type="button"
                      className="admin-small-button"
                      onClick={() => onView(user._id)}
                    >
                      View
                    </button>

                    {!isSelf && (
                      <>
                        <button
                          type="button"
                          className="admin-small-button"
                          disabled={loading}
                          onClick={() => onToggleStatus(user)}
                        >
                          {loading
                            ? "..."
                            : user.isActive
                              ? "Deactivate"
                              : "Activate"}
                        </button>

                        <button
                          type="button"
                          className="admin-small-danger-button"
                          disabled={loading}
                          onClick={() => onDelete(user)}
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
