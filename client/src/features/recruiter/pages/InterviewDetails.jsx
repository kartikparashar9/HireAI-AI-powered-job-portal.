import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchInterviewById,
  completeInterview,
  cancelInterview,
  clearSelectedInterview,
} from "../recruiterSlice";

import "../recruiter.css";

const formatValue = (value) => {
  if (!value) {
    return "Not specified";
  }

  return value
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const formatDateTime = (date) => {
  if (!date) {
    return "Not scheduled";
  }

  return new Date(date).toLocaleString("en-IN", {
    weekday: "short",
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const InterviewDetails = () => {
  const { interviewId } = useParams();

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [interview, setInterview] = useState(location.state?.interview || null);

  const [isLoading, setIsLoading] = useState(!interview);

  const { selectedInterview, interviewsError, isSubmitting } = useSelector(
    (state) => state.recruiter,
  );

  useEffect(() => {
    if (interviewId) {
      dispatch(fetchInterviewById(interviewId));
    }

    return () => {
      dispatch(clearSelectedInterview());
    };
  }, [dispatch, interviewId]);

  useEffect(() => {
    if (selectedInterview) {
      setInterview(selectedInterview);

      setIsLoading(false);
    }
  }, [selectedInterview]);

  useEffect(() => {
    if (!interview) {
      const timeout = setTimeout(() => {
        setIsLoading(false);
      }, 1000);

      return () => clearTimeout(timeout);
    }

    setIsLoading(false);
  }, [interview]);

  const handleComplete = async () => {
    if (!interview?._id) {
      return;
    }

    const confirmed = window.confirm("Mark this interview as completed?");

    if (!confirmed) {
      return;
    }

    const result = await dispatch(completeInterview({ interviewId: interview._id }));

    if (!result.error) {
      setInterview((previous) => ({
        ...previous,
        ...(result.payload || {}),
        status: "COMPLETED",
      }));
    }
  };

  const handleCancel = async () => {
    if (!interview?._id) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to cancel this interview?",
    );

    if (!confirmed) {
      return;
    }

    const result = await dispatch(cancelInterview({ interviewId: interview._id }));

    if (!result.error) {
      setInterview((previous) => ({
        ...previous,
        ...(result.payload || {}),
        status: "CANCELLED",
      }));
    }
  };

  if (isLoading) {
    return (
      <div className="recruiter-page">
        <div className="recruiter-loading">Loading interview...</div>
      </div>
    );
  }

  if (!interview || interviewsError) {
    return (
      <div className="recruiter-page">
        <div className="recruiter-error-message">
          {interviewsError || "Interview not found."}
        </div>

        <button
          type="button"
          className="recruiter-primary-button"
          onClick={() => navigate("/recruiter/interviews")}
        >
          Back to Interviews
        </button>
      </div>
    );
  }

  const status = interview.status || "SCHEDULED";

  const canComplete = status === "SCHEDULED";

  const canCancel = status === "SCHEDULED";

  return (
    <div className="recruiter-page">
      <div className="recruiter-interview-details-top">
        <button
          type="button"
          className="recruiter-back-button"
          onClick={() => navigate("/recruiter/interviews")}
        >
          ← Back to Interviews
        </button>

        <span
          className={`recruiter-interview-status recruiter-interview-status-${status.toLowerCase()}`}
        >
          {formatValue(status)}
        </span>
      </div>

      <div className="recruiter-interview-details-card">
        <div className="recruiter-interview-details-header">
          <div className="recruiter-candidate-info">
            <div className="recruiter-candidate-avatar recruiter-candidate-avatar-large">
              {interview.candidate?.avatar ? (
                <img
                  src={interview.candidate.avatar}
                  alt={interview.candidate.name || "Candidate"}
                />
              ) : (
                <span>
                  {(interview.candidate?.name || "C").charAt(0).toUpperCase()}
                </span>
              )}
            </div>

            <div>
              <p className="recruiter-page-eyebrow">Interview</p>

              <h1>{interview.candidate?.name || "Candidate"}</h1>

              <p>{interview.candidate?.email || "Email unavailable"}</p>
            </div>
          </div>

          <div className="recruiter-interview-detail-actions">
            {canComplete && (
              <button
                type="button"
                className="recruiter-complete-button"
                onClick={handleComplete}
                disabled={isSubmitting}
              >
                Complete
              </button>
            )}

            {canCancel && (
              <button
                type="button"
                className="recruiter-delete-button"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        <section className="recruiter-interview-detail-section">
          <h2>Interview Information</h2>

          <div className="recruiter-interview-detail-grid">
            <div>
              <span>Position</span>

              <strong>{interview.job?.title || "Job Position"}</strong>
            </div>

            <div>
              <span>Interview Type</span>

              <strong>{formatValue(interview.type)}</strong>
            </div>

            <div>
              <span>Scheduled At</span>

              <strong>{formatDateTime(interview.scheduledAt)}</strong>
            </div>

            <div>
              <span>Duration</span>

              <strong>{interview.durationMinutes || 30} minutes</strong>
            </div>

            <div>
              <span>Status</span>

              <strong>{formatValue(status)}</strong>
            </div>

            <div>
              <span>Application</span>

              <strong>{interview.application?._id || "Not available"}</strong>
            </div>
          </div>
        </section>

        {interview.meetingLink && (
          <section className="recruiter-interview-detail-section">
            <h2>Meeting</h2>

            <div className="recruiter-interview-meeting-box">
              <div>
                <span>Meeting Link</span>

                <strong>{interview.meetingLink}</strong>
              </div>

              <a
                href={interview.meetingLink}
                target="_blank"
                rel="noreferrer"
                className="recruiter-primary-button"
              >
                Join Meeting
              </a>
            </div>
          </section>
        )}

        {interview.location && (
          <section className="recruiter-interview-detail-section">
            <h2>Location</h2>

            <p>{interview.location}</p>
          </section>
        )}

        {interview.notes && (
          <section className="recruiter-interview-detail-section">
            <h2>Notes</h2>

            <div className="recruiter-interview-notes-full">
              <p>{interview.notes}</p>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default InterviewDetails;
