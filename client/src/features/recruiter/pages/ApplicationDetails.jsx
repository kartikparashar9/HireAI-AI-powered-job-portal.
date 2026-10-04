import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchMyJobs,
  fetchJobApplications,
  updateApplicationStatus,
} from "../recruiterSlice";

import ApplicationStatusForm from "../components/applications/ApplicationStatusForm";

import "../recruiter.css";

const formatStatus = (status) => {
  if (!status) {
    return "Unknown";
  }

  return status
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const formatDate = (date) => {
  if (!date) {
    return "Not available";
  }

  return new Date(date).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const ApplicationDetails = () => {
  const { applicationId } = useParams();

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [application, setApplication] = useState(
    location.state?.application || null,
  );

  const [showStatusForm, setShowStatusForm] = useState(false);

  const [isLoading, setIsLoading] = useState(!application);

  const { jobs, applications, isSubmitting, applicationsError } = useSelector(
    (state) => state.recruiter,
  );

  useEffect(() => {
    if (application) {
      return;
    }

    const loadApplication = async () => {
      setIsLoading(true);

      const jobsResult = await dispatch(fetchMyJobs());

      const recruiterJobs = jobsResult.payload || [];

      let foundApplication = null;

      for (const job of recruiterJobs) {
        const result = await dispatch(fetchJobApplications(job._id));

        const jobApplications = result.payload || [];

        foundApplication = jobApplications.find(
          (item) => item._id === applicationId,
        );

        if (foundApplication) {
          break;
        }
      }

      if (foundApplication) {
        setApplication(foundApplication);
      }

      setIsLoading(false);
    };

    if (applicationId) {
      loadApplication();
    }
  }, [application, applicationId, dispatch]);

  useEffect(() => {
    if (!applicationId) {
      return;
    }

    const updatedApplication = applications?.find(
      (item) => item._id === applicationId,
    );

    if (updatedApplication) {
      setApplication(updatedApplication);
    }
  }, [applications, applicationId]);

  const handleUpdateStatus = async (data) => {
    if (!application?._id) {
      return;
    }

    const result = await dispatch(
      updateApplicationStatus({
        applicationId: application._id,
        status: data.status,
        recruiterNote: data.recruiterNote,
      }),
    );

    if (!result.error) {
      const updated = result.payload;

      if (updated) {
        setApplication(updated);
      } else {
        setApplication((previous) => ({
          ...previous,
          ...data,
        }));
      }

      setShowStatusForm(false);
    }
  };

  if (isLoading) {
    return (
      <div className="recruiter-page">
        <div className="recruiter-loading">Loading application...</div>
      </div>
    );
  }

  if (applicationsError || !application) {
    return (
      <div className="recruiter-page">
        <div className="recruiter-error-message">
          {applicationsError || "Application not found."}
        </div>

        <button
          type="button"
          className="recruiter-primary-button"
          onClick={() => navigate("/recruiter/applications")}
        >
          Back to Applications
        </button>
      </div>
    );
  }

  const candidate = application.candidate;

  const job = application.job || location.state?.job;

  return (
    <div className="recruiter-page">
      <div className="recruiter-application-details-top">
        <button
          type="button"
          className="recruiter-back-button"
          onClick={() => navigate("/recruiter/applications")}
        >
          ← Back to Applications
        </button>

        <span
          className={`recruiter-application-status recruiter-application-status-${(
            application.status || "PENDING"
          ).toLowerCase()}`}
        >
          {formatStatus(application.status || "PENDING")}
        </span>
      </div>

      <div className="recruiter-application-details-card">
        <div className="recruiter-application-details-header">
          <div className="recruiter-candidate-info">
            <div className="recruiter-candidate-avatar recruiter-candidate-avatar-large">
              {candidate?.avatar ? (
                <img
                  src={candidate.avatar}
                  alt={candidate.name || "Candidate"}
                />
              ) : (
                <span>{(candidate?.name || "C").charAt(0).toUpperCase()}</span>
              )}
            </div>

            <div>
              <p className="recruiter-page-eyebrow">Candidate</p>

              <h1>{candidate?.name || "Unknown Candidate"}</h1>

              <p>{candidate?.email || "Email unavailable"}</p>
            </div>
          </div>

          <button
            type="button"
            className="recruiter-primary-button"
            onClick={() => setShowStatusForm((previous) => !previous)}
          >
            {showStatusForm ? "Close" : "Update Status"}
          </button>
        </div>

        {showStatusForm && (
          <div className="recruiter-status-form-card recruiter-status-form-card-inline">
            <ApplicationStatusForm
              application={application}
              onSubmit={handleUpdateStatus}
              onCancel={() => setShowStatusForm(false)}
              isSubmitting={isSubmitting}
            />
          </div>
        )}

        {job && (
          <section className="recruiter-application-detail-section">
            <h2>Applied Position</h2>

            <div className="recruiter-application-job-detail">
              <strong>{job.title || "Job Position"}</strong>

              {job.location && <span>{job.location}</span>}
            </div>
          </section>
        )}

        <section className="recruiter-application-detail-section">
          <h2>Application Information</h2>

          <div className="recruiter-application-detail-grid">
            <div>
              <span>Status</span>

              <strong>{formatStatus(application.status)}</strong>
            </div>

            <div>
              <span>Applied On</span>

              <strong>{formatDate(application.appliedAt)}</strong>
            </div>

            <div>
              <span>Status Updated</span>

              <strong>{formatDate(application.statusUpdatedAt)}</strong>
            </div>

            <div>
              <span>Application ID</span>

              <strong>{application._id}</strong>
            </div>
          </div>
        </section>

        {application.resume && (
          <section className="recruiter-application-detail-section">
            <h2>Resume</h2>

            <div className="recruiter-resume-box">
              <div>
                <strong>
                  {application.resume.title ||
                    application.resume.fileName ||
                    "Candidate Resume"}
                </strong>

                {application.resume.fileName && (
                  <span>{application.resume.fileName}</span>
                )}
              </div>

              {application.resume.fileUrl && (
                <a
                  href={application.resume.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="recruiter-primary-button"
                >
                  View Resume
                </a>
              )}
            </div>
          </section>
        )}

        {application.coverLetter && (
          <section className="recruiter-application-detail-section">
            <h2>Cover Letter</h2>

            <div className="recruiter-cover-letter-full">
              <p>{application.coverLetter}</p>
            </div>
          </section>
        )}

        {application.recruiterNote && (
          <section className="recruiter-application-detail-section">
            <h2>Recruiter Note</h2>

            <div className="recruiter-recruiter-note">
              <p>{application.recruiterNote}</p>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ApplicationDetails;
