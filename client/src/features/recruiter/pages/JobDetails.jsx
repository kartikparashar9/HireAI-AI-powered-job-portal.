import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { fetchJobById, clearSelectedJob } from "../recruiterSlice";

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

const formatDate = (date) => {
  if (!date) {
    return "Not specified";
  }

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

const formatSalary = (min, max) => {
  if (!min && !max) {
    return "Not disclosed";
  }

  const format = (value) => new Intl.NumberFormat("en-IN").format(value);

  if (min && max) {
    return `₹${format(min)} - ₹${format(max)}`;
  }

  if (min) {
    return `₹${format(min)}+`;
  }

  return `Up to ₹${format(max)}`;
};

const JobDetails = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { selectedJob, jobLoading, jobsError } = useSelector(
    (state) => state.recruiter,
  );

  useEffect(() => {
    if (jobId) {
      dispatch(fetchJobById(jobId));
    }

    return () => {
      dispatch(clearSelectedJob());
    };
  }, [dispatch, jobId]);

  if (jobLoading) {
    return (
      <div className="recruiter-page">
        <div className="recruiter-loading">Loading job...</div>
      </div>
    );
  }

  if (jobsError) {
    return (
      <div className="recruiter-page">
        <div className="recruiter-error-message">{jobsError}</div>

        <button
          type="button"
          className="recruiter-primary-button"
          onClick={() => navigate("/recruiter/jobs")}
        >
          Back to Jobs
        </button>
      </div>
    );
  }

  if (!selectedJob) {
    return (
      <div className="recruiter-page">
        <div className="recruiter-empty-state">
          <h3>Job not found</h3>

          <p>The requested job could not be found.</p>

          <button
            type="button"
            className="recruiter-primary-button"
            onClick={() => navigate("/recruiter/jobs")}
          >
            Back to Jobs
          </button>
        </div>
      </div>
    );
  }

  const job = selectedJob;

  return (
    <div className="recruiter-page">
      <div className="recruiter-job-details-top">
        <button
          type="button"
          className="recruiter-back-button"
          onClick={() => navigate("/recruiter/jobs")}
        >
          ← Back to Jobs
        </button>

        <span
          className={`recruiter-job-status recruiter-job-status-${(
            job.status || "OPEN"
          ).toLowerCase()}`}
        >
          {formatValue(job.status || "OPEN")}
        </span>
      </div>

      <div className="recruiter-job-details-card">
        <div className="recruiter-job-details-header">
          <div>
            <p className="recruiter-page-eyebrow">Job Posting</p>

            <h1>{job.title}</h1>

            <p className="recruiter-job-location">
              {job.location || "Location not specified"}
            </p>
          </div>

          <div className="recruiter-job-detail-actions">
            <button
              type="button"
              className="recruiter-primary-button"
              onClick={() =>
                navigate(`/recruiter/applications?jobId=${job._id}`)
              }
            >
              View Applications
            </button>
          </div>
        </div>

        <div className="recruiter-job-details-grid">
          <div>
            <span>Job Type</span>
            <strong>{formatValue(job.jobType)}</strong>
          </div>

          <div>
            <span>Work Mode</span>
            <strong>{formatValue(job.workMode)}</strong>
          </div>

          <div>
            <span>Experience</span>
            <strong>
              {job.experienceMin !== undefined &&
              job.experienceMax !== undefined
                ? `${job.experienceMin} - ${job.experienceMax} years`
                : "Not specified"}
            </strong>
          </div>

          <div>
            <span>Salary</span>
            <strong>{formatSalary(job.salaryMin, job.salaryMax)}</strong>
          </div>

          <div>
            <span>Application Deadline</span>
            <strong>{formatDate(job.applicationDeadline)}</strong>
          </div>

          <div>
            <span>Posted On</span>
            <strong>{formatDate(job.createdAt)}</strong>
          </div>
        </div>

        {job.description && (
          <section className="recruiter-job-detail-section">
            <h2>Description</h2>

            <p>{job.description}</p>
          </section>
        )}

        {Array.isArray(job.skills) && job.skills.length > 0 && (
          <section className="recruiter-job-detail-section">
            <h2>Required Skills</h2>

            <div className="recruiter-job-skills">
              {job.skills.map((skill) => (
                <span key={skill}>{skill}</span>
              ))}
            </div>
          </section>
        )}

        {job.company && (
          <section className="recruiter-job-detail-section">
            <h2>Company</h2>

            <div className="recruiter-job-company-info">
              {job.company.logo && (
                <img
                  src={job.company.logo}
                  alt={job.company.name || "Company"}
                />
              )}

              <div>
                <strong>{job.company.name || "Company"}</strong>

                {job.company.location && <span>{job.company.location}</span>}
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default JobDetails;
