import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchMyInterviews,
  fetchShortlistedApplications,
  createInterview,
  updateInterview,
  completeInterview,
  cancelInterview,
  clearSelectedInterview,
  clearRecruiterError,
  clearRecruiterSuccess,
} from "../recruiterSlice";

import InterviewForm from "../components/interviews/InterviewForm";
import InterviewList from "../components/interviews/InterviewList";

import "../recruiter.css";

const InterviewsManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showForm, setShowForm] = useState(false);
  const [editingInterview, setEditingInterview] = useState(null);

  const {
    interviews,
    interviewsLoading,
    interviewsError,
    shortlistedApplications,
    shortlistedApplicationsLoading,
    isSubmitting,
    successMessage,
  } = useSelector((state) => state.recruiter);

  useEffect(() => {
    dispatch(fetchMyInterviews());

    return () => {
      dispatch(clearSelectedInterview());
      dispatch(clearRecruiterError());
      dispatch(clearRecruiterSuccess());
    };
  }, [dispatch]);

  const interviewStats = useMemo(() => {
    const safeInterviews = Array.isArray(interviews) ? interviews : [];

    return {
      total: safeInterviews.length,

      scheduled: safeInterviews.filter(
        (interview) => interview.status === "SCHEDULED",
      ).length,

      completed: safeInterviews.filter(
        (interview) => interview.status === "COMPLETED",
      ).length,

      cancelled: safeInterviews.filter(
        (interview) => interview.status === "CANCELLED",
      ).length,
    };
  }, [interviews]);

  const handleCreateClick = async () => {
    setEditingInterview(null);

    await dispatch(fetchShortlistedApplications());

    setShowForm(true);
  };

  const handleCreateInterview = async (data) => {
    const result = await dispatch(createInterview(data));

    if (!result.error) {
      setShowForm(false);
      await dispatch(fetchMyInterviews());
    }
  };

  const handleEdit = (interview) => {
    setEditingInterview(interview);
    setShowForm(false);
  };

  const handleUpdateInterview = async (data) => {
    if (!editingInterview?._id) {
      return;
    }

    const result = await dispatch(
      updateInterview({
        interviewId: editingInterview._id,
        interviewData: data,
      }),
    );

    if (!result.error) {
      setEditingInterview(null);
      await dispatch(fetchMyInterviews());
    }
  };

  const handleComplete = async (interview) => {
    if (!interview?._id) {
      return;
    }

    const confirmed = window.confirm("Mark this interview as completed?");

    if (!confirmed) {
      return;
    }

    const result = await dispatch(
      completeInterview({
        interviewId: interview._id,
      }),
    );

    if (!result.error) {
      await dispatch(fetchMyInterviews());
    }
  };

  const handleCancel = async (interview) => {
    if (!interview?._id) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to cancel this interview?",
    );

    if (!confirmed) {
      return;
    }

    const result = await dispatch(
      cancelInterview({
        interviewId: interview._id,
      }),
    );

    if (!result.error) {
      await dispatch(fetchMyInterviews());
    }
  };

  const handleView = (interview) => {
    navigate(`/recruiter/interviews/${interview._id}`, {
      state: {
        interview,
      },
    });
  };

  if (interviewsLoading) {
    return (
      <div className="recruiter-page">
        <div className="recruiter-loading">Loading interviews...</div>
      </div>
    );
  }

  return (
    <div className="recruiter-page">
      <div className="recruiter-page-header">
        <div>
          <p className="recruiter-page-eyebrow">Recruiter</p>

          <h1>Interviews</h1>

          <p>Schedule and manage candidate interviews.</p>
        </div>

        {!showForm && !editingInterview && (
          <button
            type="button"
            className="recruiter-primary-button"
            onClick={handleCreateClick}
          >
            + Schedule Interview
          </button>
        )}
      </div>

      {successMessage && (
        <div className="recruiter-success-message">{successMessage}</div>
      )}

      {interviewsError && (
        <div className="recruiter-error-message">{interviewsError}</div>
      )}

      {!showForm && !editingInterview && (
        <div className="recruiter-interview-stats">
          <div>
            <span>Total</span>
            <strong>{interviewStats.total}</strong>
          </div>

          <div>
            <span>Scheduled</span>
            <strong>{interviewStats.scheduled}</strong>
          </div>

          <div>
            <span>Completed</span>
            <strong>{interviewStats.completed}</strong>
          </div>

          <div>
            <span>Cancelled</span>
            <strong>{interviewStats.cancelled}</strong>
          </div>
        </div>
      )}

      {showForm && (
        <div className="recruiter-interview-form-card">
          <div className="recruiter-interview-form-header">
            <div>
              <h2>Schedule Interview</h2>

              <p>Select a candidate application and schedule an interview.</p>
            </div>
          </div>

          {shortlistedApplicationsLoading ? (
            <div className="recruiter-loading">
              Loading shortlisted candidates...
            </div>
          ) : (
            <InterviewForm
              applications={
                Array.isArray(shortlistedApplications)
                  ? shortlistedApplications
                  : []
              }
              onSubmit={handleCreateInterview}
              onCancel={() => setShowForm(false)}
              isSubmitting={isSubmitting}
            />
          )}
        </div>
      )}

      {editingInterview && (
        <div className="recruiter-interview-form-card">
          <div className="recruiter-interview-form-header">
            <div>
              <h2>Edit Interview</h2>

              <p>Update interview schedule and details.</p>
            </div>
          </div>

          <InterviewForm
            interview={editingInterview}
            onSubmit={handleUpdateInterview}
            onCancel={() => setEditingInterview(null)}
            isSubmitting={isSubmitting}
          />
        </div>
      )}

      {!showForm && !editingInterview && (
        <InterviewList
          interviews={Array.isArray(interviews) ? interviews : []}
          onView={handleView}
          onEdit={handleEdit}
          onComplete={handleComplete}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
};

export default InterviewsManagement;
