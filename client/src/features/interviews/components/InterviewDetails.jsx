import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import InterviewStatus from "./InterviewStatus";

import {
  fetchInterviewById,
  respondToInterview,
  cancelInterview,
  clearInterviewActionError,
  clearInterviewSuccess,
  selectSelectedInterview,
  selectInterviewDetailsLoading,
  selectInterviewDetailsError,
  selectInterviewResponding,
  selectInterviewCancelling,
  selectInterviewActionError,
  selectInterviewSuccess,
} from "../interviewSlice";

import "./InterviewDetails.css";

/* =========================
   Helpers
========================= */

const getJob = (interview) =>
  interview?.job && typeof interview.job === "object" ? interview.job : null;

const getCompany = (interview, job) => {
  if (job?.company && typeof job.company === "object") {
    return job.company;
  }

  if (interview?.company && typeof interview.company === "object") {
    return interview.company;
  }

  return null;
};

const formatDate = (date) => {
  if (!date) return "Not specified";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Not specified";
  }

  return parsedDate.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const formatTime = (date) => {
  if (!date) return "Not specified";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Not specified";
  }

  return parsedDate.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
  });
};

const formatType = (type) => {
  if (!type) return "Not specified";

  return type
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const getStatusMessage = (status) => {
  switch (status) {
    case "SCHEDULED":
      return {
        title: "Interview Invitation",
        message:
          "You have been invited to this interview. Please confirm your availability.",
        icon: "📅",
        type: "scheduled",
      };

    case "CONFIRMED":
      return {
        title: "Interview Confirmed",
        message:
          "Your interview is confirmed. Join the meeting at the scheduled time.",
        icon: "✓",
        type: "confirmed",
      };

    case "RESCHEDULED":
      return {
        title: "Interview Rescheduled",
        message:
          "The interview schedule has been changed. Please review the new schedule and confirm your availability.",
        icon: "↻",
        type: "rescheduled",
      };

    case "COMPLETED":
      return {
        title: "Interview Completed",
        message:
          "This interview has already been completed. No meeting action is available.",
        icon: "✓",
        type: "completed",
      };

    case "CANCELLED":
      return {
        title: "Interview Cancelled",
        message:
          "This interview has been cancelled. No further action is required.",
        icon: "×",
        type: "cancelled",
      };

    case "DECLINED":
      return {
        title: "Interview Declined",
        message:
          "You declined this interview invitation. No further action is available.",
        icon: "×",
        type: "declined",
      };

    default:
      return {
        title: "Interview",
        message: "Please review the interview details below.",
        icon: "i",
        type: "default",
      };
  }
};

/* =========================
   Component
========================= */

const InterviewDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const interview = useSelector(selectSelectedInterview);
  const isLoading = useSelector(selectInterviewDetailsLoading);
  const error = useSelector(selectInterviewDetailsError);

  const isRespondingMap = useSelector(selectInterviewResponding);

  const isCancellingMap = useSelector(selectInterviewCancelling);

  const actionError = useSelector(selectInterviewActionError);

  const successMessage = useSelector(selectInterviewSuccess);

  const isResponding = Boolean(isRespondingMap?.[id]);

  const isCancelling = Boolean(isCancellingMap?.[id]);

  useEffect(() => {
    if (!id) return;

    dispatch(fetchInterviewById(id));

    return () => {
      dispatch(clearInterviewActionError());
      dispatch(clearInterviewSuccess());
    };
  }, [dispatch, id]);

  /* =========================
     Derived Data
  ========================= */

  const job = getJob(interview);
  const company = getCompany(interview, job);

  const companyName = company?.name || interview?.companyName || "Company";

  const jobTitle = job?.title || interview?.jobTitle || "Interview";

  const location = job?.location || interview?.location || "Not specified";

  const status = interview?.status;

  const statusInfo = getStatusMessage(status);

  const canRespond = status === "SCHEDULED" || status === "RESCHEDULED";

  const canCancel =
    status === "SCHEDULED" ||
    status === "CONFIRMED" ||
    status === "RESCHEDULED";

  /*
    Meeting can only be joined after
    interview is confirmed.
  */
  const canJoinMeeting =
    status === "CONFIRMED" && Boolean(interview?.meetingLink);

  /* =========================
     Actions
  ========================= */

  const handleRespond = (responseStatus) => {
    if (!id || isResponding || isCancelling) {
      return;
    }

    dispatch(
      respondToInterview({
        interviewId: id,
        status: responseStatus,
      }),
    );
  };

  const handleCancel = () => {
    if (!id || isResponding || isCancelling) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to cancel this interview?",
    );

    if (!confirmed) {
      return;
    }

    dispatch(cancelInterview(id));
  };

  /* =========================
     Loading
  ========================= */

  if (isLoading) {
    return (
      <div className="interview-details-page">
        <div className="interview-details-container">
          <div className="interview-details-skeleton-header" />

          <div className="interview-details-skeleton-grid">
            <div className="interview-details-skeleton-main" />
            <div className="interview-details-skeleton-side" />
          </div>
        </div>
      </div>
    );
  }

  /* =========================
     Error
  ========================= */

  if (error) {
    return (
      <div className="interview-details-page">
        <div className="interview-details-container">
          <button
            type="button"
            className="interview-details-back"
            onClick={() => navigate("/jobseeker/interviews")}
          >
            ← Back to Interviews
          </button>

          <div className="interview-details-error">
            <h2>Unable to load interview</h2>

            <p>{error}</p>

            <button
              type="button"
              onClick={() => dispatch(fetchInterviewById(id))}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!interview) {
    return null;
  }

  return (
    <div className="interview-details-page">
      <div className="interview-details-container">
        {/* Back */}

        <button
          type="button"
          className="interview-details-back"
          onClick={() => navigate("/interviews")}
        >
          ← Back to Interviews
        </button>

        {/* Alerts */}

        {successMessage && (
          <div className="interview-details-alert success">
            {successMessage}
          </div>
        )}

        {actionError && (
          <div className="interview-details-alert error">{actionError}</div>
        )}

        {/* =========================
            Status Banner
        ========================= */}

        <section className={`interview-status-banner ${statusInfo.type}`}>
          <div className="interview-status-banner-icon">{statusInfo.icon}</div>

          <div className="interview-status-banner-content">
            <h2>{statusInfo.title}</h2>

            <p>{statusInfo.message}</p>
          </div>
        </section>

        {/* =========================
            Header
        ========================= */}

        <section className="interview-details-header">
          <div className="interview-details-company-logo">
            {company?.logo ? (
              <img src={company.logo} alt={companyName} />
            ) : (
              companyName.charAt(0).toUpperCase()
            )}
          </div>

          <div className="interview-details-header-content">
            <span>Interview</span>

            <h1>{jobTitle}</h1>

            <p>{companyName}</p>

            <div className="interview-details-header-meta">
              <span>{location}</span>

              <span>•</span>

              <span>{formatType(interview.type)}</span>
            </div>
          </div>

          <InterviewStatus status={status} />
        </section>

        <div className="interview-details-grid">
          {/* =========================
              Main
          ========================= */}

          <main className="interview-details-main">
            {/* Schedule */}

            <section className="interview-details-card">
              <span className="interview-details-label">Schedule</span>

              <h2>Interview Schedule</h2>

              <div className="interview-schedule-grid">
                <div className="interview-schedule-item">
                  <span>Date</span>

                  <strong>{formatDate(interview.scheduledAt)}</strong>
                </div>

                <div className="interview-schedule-item">
                  <span>Time</span>

                  <strong>{formatTime(interview.scheduledAt)}</strong>
                </div>

                <div className="interview-schedule-item">
                  <span>Duration</span>

                  <strong>
                    {interview.durationMinutes
                      ? `${interview.durationMinutes} minutes`
                      : "Not specified"}
                  </strong>
                </div>

                <div className="interview-schedule-item">
                  <span>Interview Type</span>

                  <strong>{formatType(interview.type)}</strong>
                </div>
              </div>
            </section>

            {/* =========================
                Meeting
            ========================= */}

            <section className="interview-details-card">
              <span className="interview-details-label">Meeting</span>

              <h2>Interview Meeting</h2>

              {/* CONFIRMED + meeting link */}

              {status === "CONFIRMED" && interview.meetingLink && (
                <div className="interview-meeting-box confirmed">
                  <div className="interview-meeting-icon">🎥</div>

                  <div className="interview-meeting-content">
                    <span>Video Interview</span>

                    <strong>Your interview is ready</strong>

                    <p>Join using the meeting link at the scheduled time.</p>
                  </div>

                  <a
                    href={interview.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="interview-join-button"
                  >
                    Join Meeting
                  </a>
                </div>
              )}

              {/* SCHEDULED / RESCHEDULED */}

              {(status === "SCHEDULED" || status === "RESCHEDULED") &&
                interview.meetingLink && (
                  <div className="interview-meeting-box waiting">
                    <div className="interview-meeting-icon">🔒</div>

                    <div className="interview-meeting-content">
                      <span>Meeting Available</span>

                      <strong>Confirm your interview first</strong>

                      <p>
                        The meeting link will become available after you
                        confirm.
                      </p>
                    </div>
                  </div>
                )}

              {/* COMPLETED */}

              {status === "COMPLETED" && (
                <div className="interview-meeting-box completed">
                  <div className="interview-meeting-icon">✓</div>

                  <div className="interview-meeting-content">
                    <span>Meeting Completed</span>

                    <strong>Interview has been completed</strong>

                    <p>The meeting is no longer available to join.</p>
                  </div>
                </div>
              )}

              {/* CANCELLED */}

              {status === "CANCELLED" && (
                <div className="interview-meeting-box cancelled">
                  <div className="interview-meeting-icon">×</div>

                  <div className="interview-meeting-content">
                    <span>Meeting Cancelled</span>

                    <strong>This interview was cancelled</strong>

                    <p>No further action is available.</p>
                  </div>
                </div>
              )}

              {/* DECLINED */}

              {status === "DECLINED" && (
                <div className="interview-meeting-box declined">
                  <div className="interview-meeting-icon">×</div>

                  <div className="interview-meeting-content">
                    <span>Meeting Declined</span>

                    <strong>Interview invitation declined</strong>

                    <p>No further action is available.</p>
                  </div>
                </div>
              )}

              {/* IN PERSON */}

              {interview.type === "IN_PERSON" &&
                status !== "CANCELLED" &&
                status !== "DECLINED" &&
                status !== "COMPLETED" && (
                  <div className="interview-location-box">
                    <span>Interview Location</span>

                    <strong>{interview.location || location}</strong>
                  </div>
                )}

              {/* PHONE */}

              {interview.type === "PHONE" &&
                status !== "CANCELLED" &&
                status !== "DECLINED" &&
                status !== "COMPLETED" && (
                  <div className="interview-location-box">
                    <span>Interview Method</span>

                    <strong>Phone Interview</strong>
                  </div>
                )}

              {/* No meeting info */}

              {!interview.meetingLink && interview.type === "VIDEO" && (
                <div className="interview-no-meeting">
                  Meeting link has not been provided yet.
                </div>
              )}
            </section>

            {/* Notes */}

            <section className="interview-details-card">
              <span className="interview-details-label">Notes</span>

              <h2>Additional Information</h2>

              <div className="interview-notes">
                {interview.notes || "No additional notes have been provided."}
              </div>
            </section>
          </main>

          {/* =========================
              Sidebar
          ========================= */}

          <aside className="interview-details-sidebar">
            {/* Current Status */}

            <section className="interview-details-card">
              <span className="interview-details-label">Status</span>

              <h2>Interview Status</h2>

              <div className="interview-current-status">
                <InterviewStatus status={status} />

                <p>{statusInfo.message}</p>
              </div>
            </section>

            {/* Confirm / Decline */}

            {canRespond && (
              <section className="interview-details-card">
                <span className="interview-details-label">
                  Response Required
                </span>

                <h2>Respond to Interview</h2>

                <p className="interview-action-text">
                  Confirm the interview to make the meeting available, or
                  decline the invitation.
                </p>

                <div className="interview-response-actions">
                  <button
                    type="button"
                    className="interview-confirm-button"
                    disabled={isResponding || isCancelling}
                    onClick={() => handleRespond("CONFIRMED")}
                  >
                    {isResponding ? "Updating..." : "Confirm Interview"}
                  </button>

                  <button
                    type="button"
                    className="interview-decline-button"
                    disabled={isResponding || isCancelling}
                    onClick={() => handleRespond("DECLINED")}
                  >
                    Decline Interview
                  </button>
                </div>
              </section>
            )}

            {/* Confirmed */}

            {status === "CONFIRMED" && (
              <section className="interview-details-card interview-confirmed-card">
                <span className="interview-details-label">Ready</span>

                <h2>You're All Set</h2>

                <p className="interview-action-text">
                  Your interview is confirmed. Use the Join Meeting button when
                  it is time for your interview.
                </p>

                {canJoinMeeting && (
                  <a
                    href={interview.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="interview-sidebar-join"
                  >
                    🎥 Join Meeting
                  </a>
                )}

                {!interview.meetingLink && (
                  <div className="interview-link-pending">
                    Meeting link not available yet.
                  </div>
                )}
              </section>
            )}

            {/* Completed */}

            {status === "COMPLETED" && (
              <section className="interview-details-card interview-completed-card">
                <span className="interview-details-label">Finished</span>

                <h2>Interview Completed</h2>

                <p className="interview-action-text">
                  This interview has been completed. There are no further
                  meeting actions.
                </p>
              </section>
            )}

            {/* Cancelled */}

            {status === "CANCELLED" && (
              <section className="interview-details-card interview-cancelled-card">
                <span className="interview-details-label">Cancelled</span>

                <h2>Interview Cancelled</h2>

                <p className="interview-action-text">
                  This interview has been cancelled and cannot be joined.
                </p>
              </section>
            )}

            {/* Declined */}

            {status === "DECLINED" && (
              <section className="interview-details-card interview-declined-card">
                <span className="interview-details-label">Declined</span>

                <h2>Interview Declined</h2>

                <p className="interview-action-text">
                  You declined this interview invitation.
                </p>
              </section>
            )}

            {/* Cancel */}

            {canCancel && (
              <section className="interview-details-card interview-danger-card">
                <h2>Cancel Interview</h2>

                <p className="interview-action-text">
                  Cancel this interview if you are no longer available.
                </p>

                <button
                  type="button"
                  className="interview-cancel-button"
                  disabled={isResponding || isCancelling}
                  onClick={handleCancel}
                >
                  {isCancelling ? "Cancelling..." : "Cancel Interview"}
                </button>
              </section>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
};

export default InterviewDetails;
