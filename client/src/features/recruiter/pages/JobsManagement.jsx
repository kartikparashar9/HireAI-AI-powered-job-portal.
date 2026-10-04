import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  fetchMyCompany,
  fetchMyJobs,
  createJob,
  updateJob,
  deleteJob,
  clearRecruiterError,
  clearRecruiterSuccess,
} from "../recruiterSlice";

import JobForm from "../components/jobs/JobForm";
import JobList from "../components/jobs/JobList";

import "../recruiter.css";

const JobsManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingJob, setEditingJob] = useState(null);

  const {
    company,
    companyLoading,
    jobs,
    jobsLoading,
    jobsError,
    isSubmitting,
    successMessage,
  } = useSelector((state) => state.recruiter);

  // --------------------------------------------------
  // LOAD COMPANY
  // --------------------------------------------------

  useEffect(() => {
    dispatch(fetchMyCompany());

    return () => {
      dispatch(clearRecruiterError());
      dispatch(clearRecruiterSuccess());
    };
  }, [dispatch]);

  // --------------------------------------------------
  // LOAD JOBS
  // --------------------------------------------------

  useEffect(() => {
    if (company?._id) {
      dispatch(fetchMyJobs());
    }
  }, [dispatch, company?._id]);

  // --------------------------------------------------
  // JOB STATS
  // --------------------------------------------------

  const jobStats = useMemo(() => {
    const safeJobs = Array.isArray(jobs) ? jobs : [];

    return {
      total: safeJobs.length,
      open: safeJobs.filter((job) => job.status === "OPEN").length,
      closed: safeJobs.filter((job) => job.status === "CLOSED").length,
      draft: safeJobs.filter((job) => job.status === "DRAFT").length,
    };
  }, [jobs]);

  // --------------------------------------------------
  // CREATE JOB
  // --------------------------------------------------

  const handleOpenCreateForm = () => {
    setEditingJob(null);
    setShowCreateForm(true);
  };

  const handleCloseCreateForm = () => {
    setShowCreateForm(false);
  };

  const handleCreateJob = async (jobData) => {
    const result = await dispatch(createJob(jobData));

    if (!result.error) {
      setShowCreateForm(false);
      setEditingJob(null);

      await dispatch(fetchMyJobs());
    }

    return result;
  };

  // --------------------------------------------------
  // UPDATE JOB
  // --------------------------------------------------

  const handleUpdateJob = async (jobData) => {
    if (!editingJob?._id) {
      return;
    }

    const result = await dispatch(
      updateJob({
        jobId: editingJob._id,
        jobData,
      }),
    );

    if (!result.error) {
      setEditingJob(null);
      setShowCreateForm(false);

      await dispatch(fetchMyJobs());
    }

    return result;
  };

  // --------------------------------------------------
  // DELETE JOB
  // --------------------------------------------------

  const handleDeleteJob = async (job) => {
    if (!job?._id || isSubmitting) {
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${job.title}"?`,
    );

    if (!confirmed) {
      return;
    }

    const result = await dispatch(deleteJob(job._id));

    if (!result.error) {
      await dispatch(fetchMyJobs());
    }
  };

  // --------------------------------------------------
  // EDIT
  // --------------------------------------------------

  const handleEdit = (job) => {
    if (!job?._id) {
      return;
    }

    setShowCreateForm(false);
    setEditingJob(job);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // --------------------------------------------------
  // VIEW
  // --------------------------------------------------

  const handleView = (job) => {
    if (!job?._id) {
      return;
    }

    navigate(`/recruiter/jobs/${job._id}`);
  };

  // --------------------------------------------------
  // LOADING COMPANY
  // --------------------------------------------------

  if (companyLoading) {
    return (
      <div className="recruiter-page">
        <div className="recruiter-loading">Loading company...</div>
      </div>
    );
  }

  // --------------------------------------------------
  // NO COMPANY
  // --------------------------------------------------

  if (!company) {
    return (
      <div className="recruiter-page">
        <div className="recruiter-page-header">
          <div>
            <p className="recruiter-page-eyebrow">Recruiter</p>

            <h1>Jobs Management</h1>

            <p>Create, update and manage your job postings.</p>
          </div>
        </div>

        {jobsError && (
          <div className="recruiter-error-message">{jobsError}</div>
        )}

        <div className="recruiter-warning-card">
          <h3>Company profile required</h3>

          <p>You need to create your company before posting jobs.</p>

          <button
            type="button"
            className="recruiter-primary-button"
            onClick={() => navigate("/recruiter/company")}
          >
            Create Company
          </button>
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // MAIN PAGE
  // --------------------------------------------------

  return (
    <div className="recruiter-page">
      {/* HEADER */}

      <div className="recruiter-page-header">
        <div>
          <p className="recruiter-page-eyebrow">Recruiter</p>

          <h1>Jobs Management</h1>

          <p>Create, update and manage your job postings.</p>
        </div>

        {/* CREATE BUTTON */}

        {!showCreateForm && !editingJob && (
          <button
            type="button"
            className="recruiter-primary-button"
            onClick={handleOpenCreateForm}
          >
            + Create Job
          </button>
        )}
      </div>

      {/* SUCCESS */}

      {successMessage && (
        <div className="recruiter-success-message">{successMessage}</div>
      )}

      {/* ERROR */}

      {jobsError && <div className="recruiter-error-message">{jobsError}</div>}

      {/* LOADING JOBS */}

      {jobsLoading && <div className="recruiter-loading">Loading jobs...</div>}

      {/* STATS */}

      {!showCreateForm && !editingJob && !jobsLoading && (
        <div className="recruiter-job-stats">
          <div className="recruiter-job-stat">
            <span>Total Jobs</span>
            <strong>{jobStats.total}</strong>
          </div>

          <div className="recruiter-job-stat">
            <span>Open</span>
            <strong>{jobStats.open}</strong>
          </div>

          <div className="recruiter-job-stat">
            <span>Closed</span>
            <strong>{jobStats.closed}</strong>
          </div>

          <div className="recruiter-job-stat">
            <span>Drafts</span>
            <strong>{jobStats.draft}</strong>
          </div>
        </div>
      )}

      {/* CREATE FORM */}

      {showCreateForm && (
        <div className="recruiter-job-form-card">
          <div className="recruiter-job-form-header">
            <div>
              <h2>Create Job</h2>

              <p>Add a new opportunity to your company.</p>
            </div>
          </div>

          <JobForm
            onSubmit={handleCreateJob}
            onCancel={handleCloseCreateForm}
            isSubmitting={isSubmitting}
          />
        </div>
      )}

      {/* EDIT FORM */}

      {editingJob && (
        <div className="recruiter-job-form-card">
          <div className="recruiter-job-form-header">
            <div>
              <h2>Edit Job</h2>

              <p>Update your job posting.</p>
            </div>
          </div>

          <JobForm
            job={editingJob}
            onSubmit={handleUpdateJob}
            onCancel={() => setEditingJob(null)}
            isSubmitting={isSubmitting}
          />
        </div>
      )}

      {/* JOB LIST */}

      {!showCreateForm && !editingJob && !jobsLoading && (
        <JobList
          jobs={Array.isArray(jobs) ? jobs : []}
          onEdit={handleEdit}
          onDelete={handleDeleteJob}
          onView={handleView}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
};

export default JobsManagement;
