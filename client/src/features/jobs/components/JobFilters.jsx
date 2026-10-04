const JobFilters = ({ filters, onChange, onClear }) => {
  return (
    <aside className="jobs-filters">
      <div className="jobs-filter-header">
        <div>
          <h3>Filters</h3>
          <p>Refine your search</p>
        </div>

        <button type="button" onClick={onClear}>
          Clear
        </button>
      </div>

      {/* JOB TYPE */}

      <div className="job-filter-group">
        <label htmlFor="job-type">Job Type</label>

        <select
          id="job-type"
          value={filters.jobType}
          onChange={(event) =>
            onChange({
              jobType: event.target.value,
            })
          }
        >
          <option value="">All job types</option>

          <option value="FULL_TIME">Full-time</option>

          <option value="PART_TIME">Part-time</option>

          <option value="INTERNSHIP">Internship</option>

          <option value="CONTRACT">Contract</option>
        </select>
      </div>

      {/* WORK MODE */}

      <div className="job-filter-group">
        <label htmlFor="work-mode">Work Mode</label>

        <select
          id="work-mode"
          value={filters.workMode}
          onChange={(event) =>
            onChange({
              workMode: event.target.value,
            })
          }
        >
          <option value="">All work modes</option>

          <option value="REMOTE">Remote</option>

          <option value="HYBRID">Hybrid</option>

          <option value="ONSITE">On-site</option>
        </select>
      </div>

      {/* SKILLS */}

      <div className="job-filter-group">
        <label htmlFor="skills">Skills</label>

        <input
          id="skills"
          type="text"
          value={filters.skills}
          onChange={(event) =>
            onChange({
              skills: event.target.value,
            })
          }
          placeholder="React, Node, MongoDB"
        />
      </div>

      {/* EXPERIENCE */}

      <div className="job-filter-group">
        <label>Experience</label>

        <div className="job-filter-row">
          <input
            type="number"
            min="0"
            value={filters.experienceMin}
            placeholder="Min"
            onChange={(event) =>
              onChange({
                experienceMin: event.target.value,
              })
            }
          />

          <input
            type="number"
            min="0"
            value={filters.experienceMax}
            placeholder="Max"
            onChange={(event) =>
              onChange({
                experienceMax: event.target.value,
              })
            }
          />
        </div>
      </div>

      {/* SALARY */}

      <div className="job-filter-group">
        <label>Salary Range</label>

        <div className="job-filter-row">
          <input
            type="number"
            min="0"
            value={filters.salaryMin}
            placeholder="Min"
            onChange={(event) =>
              onChange({
                salaryMin: event.target.value,
              })
            }
          />

          <input
            type="number"
            min="0"
            value={filters.salaryMax}
            placeholder="Max"
            onChange={(event) =>
              onChange({
                salaryMax: event.target.value,
              })
            }
          />
        </div>
      </div>
    </aside>
  );
};

export default JobFilters;
