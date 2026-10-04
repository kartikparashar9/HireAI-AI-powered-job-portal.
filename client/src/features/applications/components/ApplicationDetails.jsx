import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import ApplicationStatus from "./ApplicationStatus";

import {
  fetchApplicationById,
  withdrawApplication,
  selectSelectedApplication,
  selectApplicationDetailsLoading,
  selectApplicationDetailsError,
  selectApplicationWithdrawing,
  selectApplicationSuccess,
  clearApplicationSuccess,
} from "../applicationSlice";

import "./ApplicationDetails.css";

const formatDate = (date) => {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

const getJob = (application) => {
  return application?.job || {};
};

const getCompany = (job) => {
  if (typeof job?.company === "object") {
    return job.company;
  }

  return null;
};

const ApplicationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const application = useSelector(selectSelectedApplication);

  const isLoading = useSelector(selectApplicationDetailsLoading);

  const error = useSelector(selectApplicationDetailsError);

  const withdrawing = useSelector(selectApplicationWithdrawing);

  const successMessage = useSelector(selectApplicationSuccess);

  const job = getJob(application);
  const company = getCompany(job);

  const isWithdrawing = withdrawing?.[id] || false;

  const status = application?.status || "APPLIED";

  const canWithdraw = !["REJECTED", "HIRED", "WITHDRAWN"].includes(status);

  useEffect(() => {
    if (!id) return;

    dispatch(fetchApplicationById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (!successMessage) return;

    const timer = setTimeout(() => {
      dispatch(clearApplicationSuccess());
    }, 3500);

    return () => clearTimeout(timer);
  }, [successMessage, dispatch]);

  const handleWithdraw = () => {
    if (!id || isWithdrawing || !canWithdraw) return;

    const confirmed = window.confirm(
      "Are you sure you want to withdraw this application?",
    );

    if (!confirmed) return;

    dispatch(withdrawApplication(id));
  };

  if (isLoading) {
    return (
      <div className="application-details-page">
        <div className="application-details-container">
          <div className="application-details-skeleton" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="application-details-page">
        <div className="application-details-container">
          <div className="application-details-error">
            <div className="application-details-error-icon">!</div>

            <h2>Unable to load application</h2>

            <p>{error}</p>

            <button
              type="button"
              onClick={() => dispatch(fetchApplicationById(id))}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!application) {
    return null;
  }

  const companyName =
    company?.name ||
    (typeof job.company === "string" ? job.company : "Company");

  const companyLogo = company?.logo;

  return (
    <div className="application-details-page">
      <div className="application-details-container">
        <button
          type="button"
          className="application-details-back"
          onClick={() => navigate("/jobseeker/applications")}
        >
          ← Back to Applications
        </button>

        {successMessage && (
          <div className="application-details-success">✓ {successMessage}</div>
        )}

        <header className="application-details-header">
          <div className="application-details-company">
            <div className="application-details-logo">
              {companyLogo ? (
                <img src={companyLogo} alt={companyName} />
              ) : (
                companyName.charAt(0).toUpperCase()
              )}
            </div>

            <div>
              <span>Application Details</span>

              <h1>{job.title || "Job Position"}</h1>

              <p>{companyName}</p>

              <div className="application-details-job-meta">
                {job.location && <span>{job.location}</span>}

                {job.workMode && <span>• {job.workMode}</span>}

                {job.jobType && <span>• {job.jobType.replace(/_/g, " ")}</span>}
              </div>
            </div>
          </div>

          <ApplicationStatus status={status} />
        </header>

        <div className="application-details-grid">
          <main>
            <section className="application-details-card">
              <div className="application-details-card-heading">
                <div>
                  <span>Application</span>
                  <h2>Application Overview</h2>
                </div>
              </div>

              <div className="application-overview-grid">
                <div>
                  <span>Application Status</span>
                  <ApplicationStatus status={status} />
                </div>

                <div>
                  <span>Applied On</span>
                  <strong>{formatDate(application.createdAt)}</strong>
                </div>

                <div>
                  <span>Application ID</span>
                  <strong>#{application._id?.slice(-8).toUpperCase()}</strong>
                </div>

                <div>
                  <span>Job Type</span>
                  <strong>
                    {job.jobType
                      ? job.jobType.replace(/_/g, " ")
                      : "Not specified"}
                  </strong>
                </div>
              </div>
            </section>

            <section className="application-details-card">
              <div className="application-details-card-heading">
                <div>
                  <span>Resume</span>
                  <h2>Submitted Resume</h2>
                </div>
              </div>

              {application.resume ? (
                <div className="application-resume-box">
                  <div className="application-resume-icon">PDF</div>

                  <div className="application-resume-info">
                    <strong>
                      {application.resume.title ||
                        application.resume.fileName ||
                        "Resume"}
                    </strong>

                    <span>Resume submitted with application</span>
                  </div>

                  {application.resume.fileUrl && (
                    <button
                      type="button"
                      onClick={() =>
                        window.open(
                          application.resume.fileUrl,
                          "_blank",
                          "noopener,noreferrer",
                        )
                      }
                    >
                      View Resume
                    </button>
                  )}
                </div>
              ) : (
                <div className="application-no-data">
                  No resume was submitted with this application.
                </div>
              )}
            </section>

            <section className="application-details-card">
              <div className="application-details-card-heading">
                <div>
                  <span>Your Message</span>
                  <h2>Cover Letter</h2>
                </div>
              </div>

              {application.coverLetter ? (
                <div className="application-cover-letter">
                  {application.coverLetter}
                </div>
              ) : (
                <div className="application-no-data">
                  No cover letter was submitted.
                </div>
              )}
            </section>
          </main>

          <aside className="application-details-sidebar">
            <section className="application-details-card">
              <h2>Job Information</h2>

              <div className="application-job-info-list">
                <div>
                  <span>Company</span>
                  <strong>{companyName}</strong>
                </div>

                <div>
                  <span>Location</span>
                  <strong>{job.location || "Not specified"}</strong>
                </div>

                <div>
                  <span>Work Mode</span>
                  <strong>{job.workMode || "Not specified"}</strong>
                </div>

                <div>
                  <span>Experience</span>
                  <strong>
                    {job.experienceMin ?? 0}
                    {" - "}
                    {job.experienceMax ?? "Any"} yrs
                  </strong>
                </div>
              </div>
            </section>

            {canWithdraw && (
              <section className="application-details-card application-action-card">
                <h2>Application Actions</h2>

                <p>
                  You can withdraw this application if you no longer want to be
                  considered.
                </p>

                <button
                  type="button"
                  className="application-withdraw-detail"
                  onClick={handleWithdraw}
                  disabled={isWithdrawing}
                >
                  {isWithdrawing ? "Withdrawing..." : "Withdraw Application"}
                </button>
              </section>
            )}

            {status === "WITHDRAWN" && (
              <section className="application-details-card application-status-note">
                <strong>Application withdrawn</strong>

                <p>This application is no longer active.</p>
              </section>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetails;
