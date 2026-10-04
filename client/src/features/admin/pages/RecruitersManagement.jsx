import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  approveRecruiter,
  clearAdminError,
  clearAdminSuccess,
  fetchPendingRecruiters,
  fetchRecruiters,
  rejectRecruiter,
} from "../adminSlice";

import RecruiterTable from "../components/RecruiterTable";
import ConfirmModal from "../components/ConfirmModal";
import Pagination from "../components/Pagination";

import "../styles/admin.css";

const RecruitersManagement = () => {
  const dispatch = useDispatch();

  const {
    recruiters,
    recruitersPagination,
    pendingRecruiters,
    recruitersLoading,
    error,
    success,
    actionLoadingId,
  } = useSelector((state) => state.admin);

  const [tab, setTab] = useState("pending");

  const [search, setSearch] = useState("");

  const [status, setStatus] = useState("");

  const [page, setPage] = useState(1);

  const [confirm, setConfirm] = useState(null);

  useEffect(() => {
    dispatch(fetchPendingRecruiters());
  }, [dispatch]);

  useEffect(() => {
    if (tab === "all") {
      dispatch(
        fetchRecruiters({
          page,
          limit: 20,
          search: search.trim(),
          status,
        }),
      );
    }
  }, [dispatch, tab, page, search, status]);

  const openApprove = (recruiter) => {
    setConfirm({
      type: "approve",
      recruiter,
      title: "Approve recruiter?",
      message: `${recruiter.name || recruiter.email} will be approved.`,
    });
  };

  const openReject = (recruiter) => {
    setConfirm({
      type: "reject",
      recruiter,
      title: "Reject recruiter?",
      message: `${recruiter.name || recruiter.email} will be rejected.`,
    });
  };

  const handleConfirm = async () => {
    if (!confirm?.recruiter) {
      return;
    }

    if (confirm.type === "approve") {
      await dispatch(approveRecruiter(confirm.recruiter._id));
    } else {
      await dispatch(rejectRecruiter(confirm.recruiter._id));
    }

    setConfirm(null);

    dispatch(fetchPendingRecruiters());

    if (tab === "all") {
      dispatch(
        fetchRecruiters({
          page,
          limit: 20,
          search: search.trim(),
          status,
        }),
      );
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-page-heading">
        <div>
          <span className="admin-eyebrow">Management</span>

          <h1>Recruiters</h1>

          <p>Review recruiter accounts and manage approval status.</p>
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
        <div className="admin-tabs">
          <button
            type="button"
            className={tab === "pending" ? "active" : ""}
            onClick={() => setTab("pending")}
          >
            Pending
            <span>{pendingRecruiters.length}</span>
          </button>

          <button
            type="button"
            className={tab === "all" ? "active" : ""}
            onClick={() => setTab("all")}
          >
            All Recruiters
          </button>
        </div>

        {tab === "all" && (
          <div className="admin-filter-bar">
            <input
              className="admin-input"
              placeholder="Search recruiters..."
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);

                setPage(1);
              }}
            />

            <select
              className="admin-select"
              value={status}
              onChange={(event) => {
                setStatus(event.target.value);

                setPage(1);
              }}
            >
              <option value="">All status</option>

              <option value="PENDING">Pending</option>

              <option value="APPROVED">Approved</option>

              <option value="REJECTED">Rejected</option>
            </select>
          </div>
        )}

        {recruitersLoading ? (
          <div className="admin-loading">Loading recruiters...</div>
        ) : (
          <RecruiterTable
            recruiters={tab === "pending" ? pendingRecruiters : recruiters}
            pendingOnly={tab === "pending"}
            actionLoadingId={actionLoadingId}
            onApprove={openApprove}
            onReject={openReject}
          />
        )}

        {tab === "all" && (
          <Pagination
            page={recruitersPagination?.page || page}
            totalPages={recruitersPagination?.totalPages || 1}
            disabled={recruitersLoading}
            onPageChange={setPage}
          />
        )}
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

export default RecruitersManagement;
