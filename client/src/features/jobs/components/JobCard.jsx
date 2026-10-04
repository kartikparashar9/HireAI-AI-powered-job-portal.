import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { saveJob, removeSavedJob } from "../jobSlice";
import "./JobCard.css";

/* =========================================================
   HELPERS
========================================================= */

const getCompanyName = (job) => {
  if (typeof job?.company === "string") {
    return job.company;
  }

  return job?.company?.name || "Company";
};

const getCompanyLogo = (job) => {
  if (typeof job?.company === "object") {
    return job.company?.logo || null;
  }

  return null;
};

const formatSalary = (job) => {
  const min = job?.salaryMin;
  const max = job?.salaryMax;

  if (min == null && max == null) {
    return "Salary not disclosed";
  }

  const formatAmount = (amount) => {
    if (amount == null) return "";

    return `₹${Number(amount).toLocaleString("en-IN")}`;
  };

  if (min != null && max != null) {
    return `${formatAmount(min)} - ${formatAmount(max)}`;
  }

  if (min != null) {
    return `${formatAmount(min)}+`;
  }

  return `Up to ${formatAmount(max)}`;
};

const formatExperience = (job) => {
  const min = job?.experienceMin;
  const max = job?.experienceMax;

  if (min == null && max == null) {
    return "Experience not specified";
  }

  if (min != null && max != null) {
    return `${min}-${max} yrs`;
  }

  if (min != null) {
    return `${min}+ yrs`;
  }

  return `Up to ${max} yrs`;
};

const formatJobType = (jobType) => {
  if (!jobType) {
    return null;
  }

  return jobType
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const formatWorkMode = (workMode) => {
  if (!workMode) {
    return "Work mode";
  }

  return workMode
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const formatDeadline = (deadline) => {
  if (!deadline) {
    return "Open position";
  }

  const date = new Date(deadline);

  if (Number.isNaN(date.getTime())) {
    return "Open position";
  }

  return `Apply before ${date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })}`;
};

/* =========================================================
   COMPONENT
========================================================= */

const JobCard = ({ job }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isAuthenticated, user } = useSelector((state) => state.auth);

  /*
   * IMPORTANT:
   * Optional chaining prevents the previous crash:
   *
   * Cannot read properties of undefined
   */
  const saved = useSelector(
    (state) => state.jobs?.savedJobs?.[job?._id] ?? false,
  );

  const isSaving = useSelector(
    (state) => state.jobs?.isSaveLoading?.[job?._id] ?? false,
  );

  const companyName = getCompanyName(job);
  const companyLogo = getCompanyLogo(job);

  const canUseSavedJobs = isAuthenticated && user?.role === "JOB_SEEKER";

  const jobType = formatJobType(job?.jobType);
  const workMode = formatWorkMode(job?.workMode);

  /* =========================================================
     SAVE / REMOVE
  ========================================================= */

  const handleSave = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!canUseSavedJobs || !job?._id || isSaving) {
      return;
    }

    if (saved) {
      dispatch(removeSavedJob(job._id));
      return;
    }

    dispatch(saveJob(job._id));
  };

  /* =========================================================
     VIEW JOB
  ========================================================= */

  const handleViewJob = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!canUseSavedJobs || !job?._id) {
      return;
    }

    navigate(`/jobs/${job._id}`);
  };

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <article className="job-card">
      {/* =====================================================
          TOP
      ===================================================== */}

      <div className="job-card-top">
        <div className="job-company-logo">
          {companyLogo ? (
            <img
              src={companyLogo}
              alt={`${companyName} logo`}
              onError={(event) => {
                event.currentTarget.style.display = "none";
                event.currentTarget.parentElement.textContent = companyName
                  .charAt(0)
                  .toUpperCase();
              }}
            />
          ) : (
            companyName.charAt(0).toUpperCase()
          )}
        </div>

        {canUseSavedJobs && (
          <button
            type="button"
            className={`job-save-button ${
              saved ? "job-save-button-active" : ""
            }`}
            onClick={handleSave}
            disabled={isSaving}
            aria-label={saved ? "Remove saved job" : "Save job"}
            title={saved ? "Remove saved job" : "Save job"}
          >
            {isSaving ? (
              <span className="job-save-spinner" />
            ) : (
              <svg
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill={saved ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1Z" />
              </svg>
            )}
          </button>
        )}
      </div>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <div className="job-card-content">
        <span className="job-card-company">{companyName}</span>

        <h3 className="job-card-title">{job?.title || "Untitled Position"}</h3>

        <div className="job-card-meta">
          <span>{job?.location || "Location not specified"}</span>

          <span className="job-card-meta-dot">•</span>

          <span>{workMode}</span>
        </div>

        {/* ===================================================
            TAGS
        =================================================== */}

        <div className="job-card-tags">
          {jobType && <span>{jobType}</span>}

          <span>{formatExperience(job)}</span>

          <span>{formatSalary(job)}</span>
        </div>

        {/* ===================================================
            SKILLS
        =================================================== */}

        {Array.isArray(job?.skills) && job.skills.length > 0 && (
          <div className="job-card-skills">
            {job.skills.slice(0, 4).map((skill, index) => (
              <span key={`${skill}-${index}`}>{skill}</span>
            ))}

            {job.skills.length > 4 && (
              <span className="job-card-more-skills">
                +{job.skills.length - 4}
              </span>
            )}
          </div>
        )}
      </div>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <div className="job-card-footer">
        <span className="job-card-deadline">
          {formatDeadline(job?.applicationDeadline)}
        </span>

        {canUseSavedJobs && (
          <button
            type="button"
            className="job-card-view-button"
            onClick={handleViewJob}
          >
            View Job
          </button>
        )}
      </div>
    </article>
  );
};

export default JobCard;
