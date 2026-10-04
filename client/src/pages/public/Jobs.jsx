import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import JobSearchBar from "../../features/jobs/components/JobSearchBar";
import JobFilters from "../../features/jobs/components/JobFilters";
import JobList from "../../features/jobs/components/JobList";
import JobSort from "../../features/jobs/components/JobSort";
import JobPagination from "../../features/jobs/components/JobPagination";

import {
  fetchJobs,
  setJobFilters,
  clearJobFilters,
} from "../../features/jobs/jobSlice";

import "./Jobs.css";

const Jobs = () => {
  const dispatch = useDispatch();

  const { jobs, pagination, filters, isLoading, error } = useSelector(
    (state) => state.jobs,
  );

  /*
   * ========================================================
   * FETCH JOBS
   * ========================================================
   *
   * Every time filters change, API automatically runs.
   *
   * Search
   * Filter
   * Sort
   * Clear
   *
   * all work through Redux state.
   */
  useEffect(() => {
    const params = {
      page: pagination.page || 1,
      limit: 10,
    };

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== "" && value !== null && value !== undefined) {
        params[key] = value;
      }
    });

    dispatch(fetchJobs(params));
  }, [dispatch, filters, pagination.page]);

  /*
   * ========================================================
   * SEARCH
   * ========================================================
   */

  const handleSearch = (searchValues) => {
    dispatch(
      setJobFilters({
        ...searchValues,
      }),
    );
  };

  /*
   * ========================================================
   * FILTER
   * ========================================================
   */

  const handleFilterChange = (changes) => {
    dispatch(
      setJobFilters({
        ...changes,
      }),
    );
  };

  /*
   * ========================================================
   * CLEAR FILTERS
   * ========================================================
   */

  const handleClearFilters = () => {
    dispatch(clearJobFilters());
  };

  /*
   * ========================================================
   * SORT
   * ========================================================
   */

  const handleSortChange = (sort) => {
    dispatch(
      setJobFilters({
        sort,
      }),
    );
  };

  /*
   * ========================================================
   * PAGINATION
   * ========================================================
   */

  const handlePageChange = (page) => {
    dispatch(
      setJobFilters({
        page,
      }),
    );
  };

  return (
    <div className="jobs-page">
      {/* =================================================
          HEADER
      ================================================= */}

      <div className="jobs-page-header">
        <div>
          <span className="jobs-eyebrow">JOB SEARCH</span>

          <h1>Find your next opportunity</h1>

          <p>
            Discover jobs that match your skills, experience and career goals.
          </p>
        </div>
      </div>

      {/* =================================================
          SEARCH
      ================================================= */}

      <JobSearchBar
        initialKeyword={filters.keyword}
        initialLocation={filters.location}
        onSearch={handleSearch}
      />

      {/* =================================================
          CONTENT
      ================================================= */}

      <div className="jobs-layout">
        <JobFilters
          filters={filters}
          onChange={handleFilterChange}
          onClear={handleClearFilters}
        />

        <section className="jobs-results">
          <div className="jobs-results-header">
            <div>
              <h2>{pagination.totalJobs || jobs.length} Jobs found</h2>

              <p>Opportunities matching your search.</p>
            </div>

            <JobSort value={filters.sort} onChange={handleSortChange} />
          </div>

          {error && <div className="jobs-error">{error}</div>}

          <JobList jobs={jobs} isLoading={isLoading} />

          {!isLoading && (
            <JobPagination
              pagination={pagination}
              onPageChange={handlePageChange}
            />
          )}
        </section>
      </div>
    </div>
  );
};

export default Jobs;
