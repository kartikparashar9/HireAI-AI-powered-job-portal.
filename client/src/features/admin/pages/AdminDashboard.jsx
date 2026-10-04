import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  approveRecruiter,
  fetchCompanies,
  fetchPendingRecruiters,
  fetchRecruiters,
  fetchUsers,
  rejectRecruiter,
} from "../adminSlice";

import AdminStatCard from "../components/AdminStatCard";
import RecruiterTable from "../components/RecruiterTable";
import ConfirmModal from "../components/ConfirmModal";

import "../styles/admin.css";

const AdminDashboard = () => {
  const dispatch = useDispatch();

  const {
    usersPagination,
    recruitersPagination,
    pendingRecruiters,
    companiesPagination,
    actionLoadingId,
    error,
    success,
  } = useSelector((state) => state.admin);

  const [confirm, setConfirm] = useState(null);

  useEffect(() => {
    dispatch(
      fetchUsers({
        page: 1,
        limit: 1,
      }),
    );

    dispatch(
      fetchRecruiters({
        page: 1,
        limit: 1,
      }),
    );

    dispatch(fetchPendingRecruiters());

    dispatch(
      fetchCompanies({
        page: 1,
        limit: 1,
      }),
    );
  }, [dispatch]);

  const openApprove = (recruiter) => {
    setConfirm({
      type: "approve",
      recruiter,
      title: "Approve recruiter?",
      message: `${
        recruiter.name || recruiter.email
      } will be allowed to use approved recruiter features.`,
    });
  };

  const openReject = (recruiter) => {
    setConfirm({
      type: "reject",
      recruiter,
      title: "Reject recruiter?",
      message: `${
        recruiter.name || recruiter.email
      } will be marked as rejected.`,
    });
  };

  const handleConfirm = async () => {
    if (!confirm?.recruiter) return;

    if (confirm.type === "approve") {
      await dispatch(approveRecruiter(confirm.recruiter._id));
    } else {
      await dispatch(rejectRecruiter(confirm.recruiter._id));
    }

    setConfirm(null);

    dispatch(fetchPendingRecruiters());
  };

  return (
    <div className="admin-page">
      <div className="admin-page-heading">
        <div>
          <span className="admin-eyebrow">HireAI Admin</span>

          <h1>Dashboard</h1>

          <p>Monitor users, recruiters and companies across the platform.</p>
        </div>
      </div>

      {error && <div className="admin-alert error">{error}</div>}

      {success && <div className="admin-alert success">{success}</div>}

      <div className="admin-stat-grid">
        <AdminStatCard
          label="Total Users"
          value={usersPagination?.total ?? 0}
          description="Registered platform users"
          icon="U"
        />

        <AdminStatCard
          label="Recruiters"
          value={recruitersPagination?.total ?? 0}
          description="All recruiter accounts"
          icon="R"
        />

        <AdminStatCard
          label="Pending Approval"
          value={pendingRecruiters.length}
          description="Recruiters awaiting review"
          icon="P"
        />

        <AdminStatCard
          label="Companies"
          value={companiesPagination?.total ?? 0}
          description="Registered companies"
          icon="C"
        />
      </div>

      <section className="admin-section-card">
        <div className="admin-section-heading">
          <div>
            <h2>Pending Recruiter Approvals</h2>

            <p>Review recruiter accounts before approving access.</p>
          </div>
        </div>

        <RecruiterTable
          recruiters={pendingRecruiters}
          pendingOnly
          actionLoadingId={actionLoadingId}
          onApprove={openApprove}
          onReject={openReject}
        />
      </section>

      <ConfirmModal
        open={Boolean(confirm)}
        title={confirm?.title}
        message={confirm?.message}
        danger={confirm?.type === "reject"}
        confirmText={confirm?.type === "reject" ? "Reject" : "Approve"}
        loading={Boolean(actionLoadingId)}
        onConfirm={handleConfirm}
        onCancel={() => setConfirm(null)}
      />
    </div>
  );
};

export default AdminDashboard;
