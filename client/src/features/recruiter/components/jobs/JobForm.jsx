import { useEffect, useState } from "react";

const createInitialForm = () => ({
  title: "",
  description: "",
  location: "",
  jobType: "FULL_TIME",
  workMode: "ONSITE",
  experienceMin: "0",
  experienceMax: "2",
  salaryMin: "",
  salaryMax: "",
  skills: "",
  requirements: "",
  responsibilities: "",
  deadline: "",
});

const JOB_TYPES = [
  {
    value: "FULL_TIME",
    label: "Full Time",
  },
  {
    value: "PART_TIME",
    label: "Part Time",
  },
  {
    value: "CONTRACT",
    label: "Contract",
  },
  {
    value: "INTERNSHIP",
    label: "Internship",
  },
  {
    value: "FREELANCE",
    label: "Freelance",
  },
];

const WORK_MODES = [
  {
    value: "ONSITE",
    label: "On-site",
  },
  {
    value: "REMOTE",
    label: "Remote",
  },
  {
    value: "HYBRID",
    label: "Hybrid",
  },
];

const normalizeArrayInput = (value, separator = ",") => {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  if (!value) {
    return [];
  }

  return String(value)
    .split(separator)
    .map((item) => item.trim())
    .filter(Boolean);
};

const formatDateForInput = (value) => {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const getInitialForm = (job) => {
  if (!job) {
    return createInitialForm();
  }

  return {
    title: job.title || "",
    description: job.description || "",
    location: job.location || "",

    jobType: job.jobType || job.employmentType || "FULL_TIME",

    workMode: job.workMode || "ONSITE",

    experienceMin:
      job.experienceMin !== undefined && job.experienceMin !== null
        ? String(job.experienceMin)
        : "0",

    experienceMax:
      job.experienceMax !== undefined && job.experienceMax !== null
        ? String(job.experienceMax)
        : "2",

    salaryMin:
      job.salaryMin !== undefined && job.salaryMin !== null
        ? String(job.salaryMin)
        : "",

    salaryMax:
      job.salaryMax !== undefined && job.salaryMax !== null
        ? String(job.salaryMax)
        : "",

    skills: Array.isArray(job.skills)
      ? job.skills.join(", ")
      : job.skills || "",

    requirements: Array.isArray(job.requirements)
      ? job.requirements.join("\n")
      : job.requirements || "",

    responsibilities: Array.isArray(job.responsibilities)
      ? job.responsibilities.join("\n")
      : job.responsibilities || "",

    deadline: formatDateForInput(job.deadline || job.applicationDeadline),
  };
};

const JobForm = ({ job = null, onSubmit, onCancel, isSubmitting = false }) => {
  const [form, setForm] = useState(() => getInitialForm(job));

  const [errors, setErrors] = useState({});

  useEffect(() => {
    setForm(getInitialForm(job));
    setErrors({});
  }, [job]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => {
      if (!previous[name]) {
        return previous;
      }

      const next = {
        ...previous,
      };

      delete next[name];

      return next;
    });
  };

  const validateForm = () => {
    const nextErrors = {};

    const title = form.title.trim();
    const description = form.description.trim();

    const experienceMin =
      form.experienceMin === "" ? 0 : Number(form.experienceMin);

    const experienceMax =
      form.experienceMax === "" ? 0 : Number(form.experienceMax);

    const salaryMin = form.salaryMin === "" ? null : Number(form.salaryMin);

    const salaryMax = form.salaryMax === "" ? null : Number(form.salaryMax);

    if (!title) {
      nextErrors.title = "Job title is required.";
    } else if (title.length < 2) {
      nextErrors.title = "Job title must be at least 2 characters.";
    }

    if (!description) {
      nextErrors.description = "Job description is required.";
    } else if (description.length < 20) {
      nextErrors.description = "Please provide at least 20 characters.";
    }

    if (!Number.isFinite(experienceMin) || experienceMin < 0) {
      nextErrors.experienceMin = "Enter a valid minimum experience.";
    }

    if (!Number.isFinite(experienceMax) || experienceMax < 0) {
      nextErrors.experienceMax = "Enter a valid maximum experience.";
    }

    if (
      Number.isFinite(experienceMin) &&
      Number.isFinite(experienceMax) &&
      experienceMax < experienceMin
    ) {
      nextErrors.experienceMax =
        "Maximum experience cannot be less than minimum.";
    }

    if (salaryMin !== null && (!Number.isFinite(salaryMin) || salaryMin < 0)) {
      nextErrors.salaryMin = "Enter a valid minimum salary.";
    }

    if (salaryMax !== null && (!Number.isFinite(salaryMax) || salaryMax < 0)) {
      nextErrors.salaryMax = "Enter a valid maximum salary.";
    }

    if (
      salaryMin !== null &&
      salaryMax !== null &&
      Number.isFinite(salaryMin) &&
      Number.isFinite(salaryMax) &&
      salaryMax < salaryMin
    ) {
      nextErrors.salaryMax = "Maximum salary cannot be less than minimum.";
    }

    if (!form.jobType) {
      nextErrors.jobType = "Please select a job type.";
    }

    if (!form.workMode) {
      nextErrors.workMode = "Please select a work mode.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const buildPayload = () => {
    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),

      jobType: form.jobType,
      workMode: form.workMode,

      experienceMin: Number(form.experienceMin || 0),
      experienceMax: Number(form.experienceMax || 0),

      skills: normalizeArrayInput(form.skills, ","),

      requirements: normalizeArrayInput(form.requirements, "\n"),

      responsibilities: normalizeArrayInput(form.responsibilities, "\n"),
    };

    const location = form.location.trim();

    if (location) {
      payload.location = location;
    }

    if (form.salaryMin !== "") {
      payload.salaryMin = Number(form.salaryMin);
    }

    if (form.salaryMax !== "") {
      payload.salaryMax = Number(form.salaryMax);
    }

    if (form.deadline) {
      payload.deadline = form.deadline;
    }

    return payload;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    if (typeof onSubmit !== "function") {
      console.error("JobForm: onSubmit callback is missing.");
      return;
    }

    const isValid = validateForm();

    if (!isValid) {
      return;
    }

    const payload = buildPayload();

    await onSubmit(payload);
  };

  return (
    <form className="recruiter-job-form" onSubmit={handleSubmit} noValidate>
      {/* BASIC INFORMATION */}

      <div className="recruiter-form-section">
        <div className="recruiter-form-section-header">
          <h3>Basic Information</h3>
          <p>Start with the role and a clear job description.</p>
        </div>

        <div className="recruiter-form-grid">
          <div className="recruiter-form-group">
            <label htmlFor="title">
              Job Title <span>*</span>
            </label>

            <input
              id="title"
              name="title"
              type="text"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. React Developer"
              disabled={isSubmitting}
              maxLength={100}
            />

            {errors.title && (
              <small className="recruiter-field-error">{errors.title}</small>
            )}
          </div>

          <div className="recruiter-form-group">
            <label htmlFor="location">Location</label>

            <input
              id="location"
              name="location"
              type="text"
              value={form.location}
              onChange={handleChange}
              placeholder="e.g. Pune, India"
              disabled={isSubmitting}
              maxLength={100}
            />
          </div>
        </div>

        <div className="recruiter-form-group">
          <label htmlFor="description">
            Job Description <span>*</span>
          </label>

          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Describe the role, what the candidate will work on, and what you expect..."
            rows={6}
            disabled={isSubmitting}
            maxLength={5000}
          />

          <div className="recruiter-form-help">
            {form.description.length}/5000 characters
          </div>

          {errors.description && (
            <small className="recruiter-field-error">
              {errors.description}
            </small>
          )}
        </div>
      </div>

      {/* JOB DETAILS */}

      <div className="recruiter-form-section">
        <div className="recruiter-form-section-header">
          <h3>Job Details</h3>
          <p>Choose how this opportunity is structured.</p>
        </div>

        <div className="recruiter-form-grid">
          <div className="recruiter-form-group">
            <label htmlFor="jobType">
              Job Type <span>*</span>
            </label>

            <select
              id="jobType"
              name="jobType"
              value={form.jobType}
              onChange={handleChange}
              disabled={isSubmitting}
            >
              {JOB_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>

            {errors.jobType && (
              <small className="recruiter-field-error">{errors.jobType}</small>
            )}
          </div>

          <div className="recruiter-form-group">
            <label htmlFor="workMode">
              Work Mode <span>*</span>
            </label>

            <select
              id="workMode"
              name="workMode"
              value={form.workMode}
              onChange={handleChange}
              disabled={isSubmitting}
            >
              {WORK_MODES.map((mode) => (
                <option key={mode.value} value={mode.value}>
                  {mode.label}
                </option>
              ))}
            </select>

            {errors.workMode && (
              <small className="recruiter-field-error">{errors.workMode}</small>
            )}
          </div>
        </div>
      </div>

      {/* EXPERIENCE & SALARY */}

      <div className="recruiter-form-section">
        <div className="recruiter-form-section-header">
          <h3>Experience & Salary</h3>

          <p>
            Leave salary blank if your company does not want to disclose it.
          </p>
        </div>

        <div className="recruiter-form-grid">
          <div className="recruiter-form-group">
            <label htmlFor="experienceMin">Minimum Experience</label>

            <input
              id="experienceMin"
              name="experienceMin"
              type="number"
              min="0"
              max="50"
              step="1"
              value={form.experienceMin}
              onChange={handleChange}
              placeholder="0"
              disabled={isSubmitting}
            />

            <div className="recruiter-form-help">
              Years. Use 0 for freshers.
            </div>

            {errors.experienceMin && (
              <small className="recruiter-field-error">
                {errors.experienceMin}
              </small>
            )}
          </div>

          <div className="recruiter-form-group">
            <label htmlFor="experienceMax">Maximum Experience</label>

            <input
              id="experienceMax"
              name="experienceMax"
              type="number"
              min="0"
              max="50"
              step="1"
              value={form.experienceMax}
              onChange={handleChange}
              placeholder="2"
              disabled={isSubmitting}
            />

            {errors.experienceMax && (
              <small className="recruiter-field-error">
                {errors.experienceMax}
              </small>
            )}
          </div>

          <div className="recruiter-form-group">
            <label htmlFor="salaryMin">Minimum Salary</label>

            <input
              id="salaryMin"
              name="salaryMin"
              type="number"
              min="0"
              step="1000"
              value={form.salaryMin}
              onChange={handleChange}
              placeholder="e.g. 500000"
              disabled={isSubmitting}
            />

            <div className="recruiter-form-help">Annual salary in INR.</div>

            {errors.salaryMin && (
              <small className="recruiter-field-error">
                {errors.salaryMin}
              </small>
            )}
          </div>

          <div className="recruiter-form-group">
            <label htmlFor="salaryMax">Maximum Salary</label>

            <input
              id="salaryMax"
              name="salaryMax"
              type="number"
              min="0"
              step="1000"
              value={form.salaryMax}
              onChange={handleChange}
              placeholder="e.g. 800000"
              disabled={isSubmitting}
            />

            {errors.salaryMax && (
              <small className="recruiter-field-error">
                {errors.salaryMax}
              </small>
            )}
          </div>
        </div>
      </div>

      {/* SKILLS */}

      <div className="recruiter-form-section">
        <div className="recruiter-form-section-header">
          <h3>Skills</h3>

          <p>Add technologies or skills separated by commas.</p>
        </div>

        <div className="recruiter-form-group">
          <label htmlFor="skills">Required Skills</label>

          <input
            id="skills"
            name="skills"
            type="text"
            value={form.skills}
            onChange={handleChange}
            placeholder="React, Node.js, MongoDB, Express"
            disabled={isSubmitting}
          />
        </div>
      </div>

      {/* REQUIREMENTS */}

      <div className="recruiter-form-section">
        <div className="recruiter-form-section-header">
          <h3>Requirements</h3>

          <p>Add one requirement per line.</p>
        </div>

        <div className="recruiter-form-group">
          <label htmlFor="requirements">Candidate Requirements</label>

          <textarea
            id="requirements"
            name="requirements"
            value={form.requirements}
            onChange={handleChange}
            placeholder={
              "Bachelor's degree in Computer Science\nGood understanding of JavaScript\nStrong problem-solving skills"
            }
            rows={5}
            disabled={isSubmitting}
          />
        </div>
      </div>

      {/* RESPONSIBILITIES */}

      <div className="recruiter-form-section">
        <div className="recruiter-form-section-header">
          <h3>Responsibilities</h3>

          <p>Add the main responsibilities, one per line.</p>
        </div>

        <div className="recruiter-form-group">
          <label htmlFor="responsibilities">What will the candidate do?</label>

          <textarea
            id="responsibilities"
            name="responsibilities"
            value={form.responsibilities}
            onChange={handleChange}
            placeholder={
              "Build React applications\nDevelop REST APIs\nWork with the product and engineering team"
            }
            rows={5}
            disabled={isSubmitting}
          />
        </div>
      </div>

      {/* DEADLINE */}

      <div className="recruiter-form-section">
        <div className="recruiter-form-section-header">
          <h3>Application Deadline</h3>

          <p>Optional. Leave blank if there is no fixed deadline.</p>
        </div>

        <div className="recruiter-form-group">
          <label htmlFor="deadline">Deadline</label>

          <input
            id="deadline"
            name="deadline"
            type="date"
            value={form.deadline}
            onChange={handleChange}
            disabled={isSubmitting}
          />
        </div>
      </div>

      {/* ACTIONS */}

      <div className="recruiter-form-actions">
        {onCancel && (
          <button
            type="button"
            className="recruiter-secondary-button"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </button>
        )}

        <button
          type="submit"
          className="recruiter-primary-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : job ? "Update Job" : "Create Job"}
        </button>
      </div>
    </form>
  );
};

export default JobForm;
