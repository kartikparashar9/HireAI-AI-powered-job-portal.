import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import {
  fetchJobById,
  checkSavedJob,
  saveJob,
  removeSavedJob,
} from "../jobSlice";

import "./JobDetails.css";

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    selectedJob,
    isDetailsLoading,
    detailsError,
    savedJobs,
    isSaveLoading,
  } = useSelector((state) => state.jobs);

  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const saved = savedJobs?.[id] ?? false;
  const saving = isSaveLoading?.[id] ?? false;

  const canSaveJob = isAuthenticated && user?.role === "JOB_SEEKER";

  useEffect(() => {
    if (!id) {
      return;
    }

    dispatch(fetchJobById(id));

    if (canSaveJob) {
      dispatch(checkSavedJob(id));
    }
  }, [dispatch, id, canSaveJob]);

  if (isDetailsLoading) {
    return (
      <div className="job-details-page">
        <div className="job-details-loading">Loading job details...</div>
      </div>
    );
  }

  if (detailsError) {
    return (
      <div className="job-details-page">
        <div className="job-details-error">
          <h2>Unable to load job</h2>

          <p>{detailsError}</p>

          <button type="button" onClick={() => navigate("/jobs")}>
            Back to Jobs
          </button>
        </div>
      </div>
    );
  }

  if (!selectedJob) {
    return null;
  }

  const company =
    typeof selectedJob.company === "object" ? selectedJob.company : null;

  const companyName = company?.name || selectedJob.company || "Company";

  const handleSave = () => {
    if (!canSaveJob) {
      return;
    }

    if (saving) {
      return;
    }

    if (saved) {
      dispatch(removeSavedJob(id));
    } else {
      dispatch(saveJob(id));
    }
  };

  return (
    <div className="job-details-page">
      <button
        type="button"
        className="job-details-back"
        onClick={() => navigate("/jobs")}
      >
        ← Back to Jobs
      </button>

      <div className="job-details-layout">
        <main className="job-details-main">
          <section className="job-details-hero">
            <div className="job-details-company-logo">
              {company?.logo ? (
                <img src={company.logo} alt={companyName} />
              ) : (
                companyName.charAt(0).toUpperCase()
              )}
            </div>

            <div className="job-details-title">
              <span>{companyName}</span>

              <h1>{selectedJob.title}</h1>

              <div className="job-details-meta">
                <span>{selectedJob.location || "Location not specified"}</span>

                {selectedJob.workMode && <span>• {selectedJob.workMode}</span>}

                {selectedJob.jobType && (
                  <span>• {selectedJob.jobType.replace(/_/g, " ")}</span>
                )}
              </div>
            </div>
          </section>

          <section className="job-details-card">
            <h2>Job Description</h2>

            <div className="job-details-description">
              {selectedJob.description || "No job description available."}
            </div>
          </section>

          {Array.isArray(selectedJob.skills) &&
            selectedJob.skills.length > 0 && (
              <section className="job-details-card">
                <h2>Required Skills</h2>

                <div className="job-details-skills">
                  {selectedJob.skills.map((skill) => (
                    <span key={skill}>{skill}</span>
                  ))}
                </div>
              </section>
            )}
        </main>

        <aside className="job-details-sidebar">
          <div className="job-details-action-card">
            <button
              type="button"
              className="job-details-apply"
              onClick={() => navigate(`/jobs/${id}/apply`)}
            >
              Apply Now
            </button>

            <button
              type="button"
              className={`job-details-save ${saved ? "active" : ""}`}
              onClick={handleSave}
              disabled={saving || !canSaveJob}
            >
              {saving ? "Saving..." : saved ? "✓ Saved" : "♡ Save Job"}
            </button>
          </div>

          <div className="job-details-card">
            <h2>Job Overview</h2>

            <div className="job-overview-item">
              <span>Experience</span>

              <strong>
                {selectedJob.experienceMin ?? 0}
                {" - "}
                {selectedJob.experienceMax ?? "Any"} yrs
              </strong>
            </div>

            <div className="job-overview-item">
              <span>Salary</span>

              <strong>
                {selectedJob.salaryMin != null || selectedJob.salaryMax != null
                  ? `₹${selectedJob.salaryMin || 0} - ₹${
                      selectedJob.salaryMax || "Negotiable"
                    }`
                  : "Not disclosed"}
              </strong>
            </div>

            <div className="job-overview-item">
              <span>Work Mode</span>

              <strong>{selectedJob.workMode || "Not specified"}</strong>
            </div>

            <div className="job-overview-item">
              <span>Job Type</span>

              <strong>
                {selectedJob.jobType
                  ? selectedJob.jobType.replace(/_/g, " ")
                  : "Not specified"}
              </strong>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default JobDetails;
