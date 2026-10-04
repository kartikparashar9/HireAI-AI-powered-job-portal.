import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  clearAdminError,
  clearAdminSuccess,
  clearSelectedUser,
  deleteUser,
  fetchUserById,
  fetchUsers,
  updateUserStatus,
} from "../adminSlice";

import UserTable from "../components/UserTable";
import ConfirmModal from "../components/ConfirmModal";
import Pagination from "../components/Pagination";
import StatusBadge from "../components/StatusBadge";

import "../styles/admin.css";

const UsersManagement = () => {
  const dispatch = useDispatch();

  const {
    users,
    usersPagination,
    usersLoading,
    selectedUser,
    error,
    success,
    actionLoadingId,
  } = useSelector((state) => state.admin);

  const currentAdminId = useSelector(
    (state) => state.auth?.user?._id || state.auth?.user?.id,
  );

  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [isActive, setIsActive] = useState("");
  const [page, setPage] = useState(1);

  const [confirm, setConfirm] = useState(null);

  const params = useMemo(
    () => ({
      page,
      limit: 20,
      search: search.trim(),
      role,
      ...(isActive === ""
        ? {}
        : {
            isActive: isActive === "true",
          }),
    }),
    [page, search, role, isActive],
  );

  useEffect(() => {
    dispatch(fetchUsers(params));
  }, [dispatch, params]);

  useEffect(() => {
    return () => {
      dispatch(clearSelectedUser());
    };
  }, [dispatch]);

  const handleToggleStatus = (user) => {
    setConfirm({
      type: "status",
      user,

      title: user.isActive ? "Deactivate user?" : "Activate user?",

      message: user.isActive
        ? `${user.name || "This user"} will be deactivated.`
        : `${user.name || "This user"} will be activated.`,
    });
  };

  const handleDelete = (user) => {
    setConfirm({
      type: "delete",
      user,
      title: "Delete user?",
      message: `This permanently deletes ${
        user.name || user.email || "this user"
      }. This action cannot be undone.`,
    });
  };

  const handleConfirm = async () => {
    if (!confirm?.user) return;

    if (confirm.type === "status") {
      await dispatch(
        updateUserStatus({
          userId: confirm.user._id,
          isActive: !confirm.user.isActive,
        }),
      );
    }

    if (confirm.type === "delete") {
      await dispatch(deleteUser(confirm.user._id));
    }

    setConfirm(null);
  };

  const handleView = (userId) => {
    dispatch(fetchUserById(userId));
  };

  return (
    <div className="admin-page">
      <div className="admin-page-heading">
        <div>
          <span className="admin-eyebrow">Management</span>

          <h1>Users</h1>

          <p>Search, review and manage HireAI user accounts.</p>
        </div>
      </div>

      {error && (
        <div className="admin-alert error">
          {error}

          <button type="button" onClick={() => dispatch(clearAdminError())}>
            ×
          </button>
        </div>
      )}

      {success && (
        <div className="admin-alert success">
          {success}

          <button type="button" onClick={() => dispatch(clearAdminSuccess())}>
            ×
          </button>
        </div>
      )}

      <section className="admin-section-card">
        <div className="admin-filter-bar">
          <input
            className="admin-input"
            placeholder="Search name or email..."
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
          />

          <select
            className="admin-select"
            value={role}
            onChange={(event) => {
              setRole(event.target.value);
              setPage(1);
            }}
          >
            <option value="">All roles</option>

            <option value="JOB_SEEKER">Job Seeker</option>

            <option value="RECRUITER">Recruiter</option>

            <option value="ADMIN">Admin</option>
          </select>

          <select
            className="admin-select"
            value={isActive}
            onChange={(event) => {
              setIsActive(event.target.value);
              setPage(1);
            }}
          >
            <option value="">All status</option>

            <option value="true">Active</option>

            <option value="false">Inactive</option>
          </select>
        </div>

        {usersLoading ? (
          <div className="admin-loading">Loading users...</div>
        ) : (
          <UserTable
            users={users}
            currentAdminId={currentAdminId}
            actionLoadingId={actionLoadingId}
            onToggleStatus={handleToggleStatus}
            onDelete={handleDelete}
            onView={handleView}
          />
        )}

        <Pagination
          page={usersPagination?.page || page}
          totalPages={usersPagination?.totalPages || 1}
          disabled={usersLoading}
          onPageChange={setPage}
        />
      </section>

      {selectedUser && (
        <div className="admin-details-panel">
          <div className="admin-details-header">
            <div>
              <span className="admin-eyebrow">User Details</span>

              <h2>{selectedUser.name || "User"}</h2>
            </div>

            <button
              type="button"
              className="admin-icon-button"
              onClick={() => dispatch(clearSelectedUser())}
            >
              ×
            </button>
          </div>

          <div className="admin-details-grid">
            <div>
              <span>Name</span>
              <strong>{selectedUser.name || "—"}</strong>
            </div>

            <div>
              <span>Email</span>
              <strong>{selectedUser.email || "—"}</strong>
            </div>

            <div>
              <span>Status</span>
              <StatusBadge active={selectedUser.isActive} />
            </div>

            <div>
              <span>Email Verification</span>

              <StatusBadge
                status={
                  selectedUser.isEmailVerified ? "VERIFIED" : "UNVERIFIED"
                }
              />
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        open={Boolean(confirm)}
        title={confirm?.title}
        message={confirm?.message}
        danger={confirm?.type === "delete"}
        confirmText={confirm?.type === "delete" ? "Delete" : "Confirm"}
        loading={Boolean(actionLoadingId)}
        onConfirm={handleConfirm}
        onCancel={() => setConfirm(null)}
      />
    </div>
  );
};

export default UsersManagement;
