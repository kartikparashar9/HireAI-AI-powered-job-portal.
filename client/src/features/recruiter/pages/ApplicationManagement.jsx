import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchMyJobs,
  fetchJobApplications,
  updateApplicationStatus,
  clearApplications,
  clearRecruiterError,
  clearRecruiterSuccess,
} from "../recruiterSlice";

import ApplicationList from "../components/applications/ApplicationList";
import ApplicationStatusForm from "../components/applications/ApplicationStatusForm";

import "../recruiter.css";

const ApplicationsManagement = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const jobId = searchParams.get("jobId") || "";

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [selectedApplication, setSelectedApplication] = useState(null);

  const [showStatusForm, setShowStatusForm] = useState(false);

  const {
    jobs,
    jobsLoading,
    applications,
    applicationsLoading,
    applicationsError,
    isSubmitting,
    successMessage,
  } = useSelector((state) => state.recruiter);

  useEffect(() => {
    dispatch(fetchMyJobs());

    return () => {
      dispatch(clearApplications());
      dispatch(clearRecruiterError());
      dispatch(clearRecruiterSuccess());
    };
  }, [dispatch]);

  useEffect(() => {
    if (jobId) {
      dispatch(fetchJobApplications(jobId));
    } else {
      dispatch(clearApplications());
    }
  }, [dispatch, jobId]);

  const selectedJob = useMemo(() => {
    if (!jobId || !Array.isArray(jobs)) {
      return null;
    }

    return jobs.find((job) => job._id === jobId) || null;
  }, [jobs, jobId]);

  const applicationStats = useMemo(() => {
    const safeApplications = Array.isArray(applications) ? applications : [];

    return {
      total: safeApplications.length,

      pending: safeApplications.filter(
        (application) => application.status === "PENDING",
      ).length,

      reviewing: safeApplications.filter(
        (application) => application.status === "REVIEWING",
      ).length,

      shortlisted: safeApplications.filter(
        (application) => application.status === "SHORTLISTED",
      ).length,

      accepted: safeApplications.filter(
        (application) => application.status === "ACCEPTED",
      ).length,

      rejected: safeApplications.filter(
        (application) => application.status === "REJECTED",
      ).length,
    };
  }, [applications]);

  const handleJobChange = (event) => {
    const selectedJobId = event.target.value;

    if (!selectedJobId) {
      setSearchParams({});
      return;
    }

    setSearchParams({ jobId: selectedJobId });
  };

  const handleViewApplication = (application) => {
    navigate(`/recruiter/applications/${application._id}`, {
      state: {
        application,
        job: selectedJob,
      },
    });
  };

  const handleStatusChange = (application) => {
    setSelectedApplication(application);
    setShowStatusForm(true);
  };

  const handleUpdateStatus = async (data) => {
    if (!selectedApplication?._id) {
      return;
    }

    const result = await dispatch(
      updateApplicationStatus({
        applicationId: selectedApplication._id,
        status: data.status,
        recruiterNote: data.recruiterNote,
      }),
    );

    if (!result.error) {
      setShowStatusForm(false);
      setSelectedApplication(null);

      if (jobId) {
        dispatch(fetchJobApplications(jobId));
      }
    }
  };

  if (jobsLoading) {
    return (
      <div className="recruiter-page">
        <div className="recruiter-loading">Loading applications...</div>
      </div>
    );
  }

  return (
    <div className="recruiter-page">
      <div className="recruiter-page-header">
        <div>
          <p className="recruiter-page-eyebrow">Recruiter</p>

          <h1>Applications</h1>

          <p>Review candidates and manage application status.</p>
        </div>
      </div>

      {successMessage && (
        <div className="recruiter-success-message">{successMessage}</div>
      )}

      {applicationsError && (
        <div className="recruiter-error-message">{applicationsError}</div>
      )}

      <div className="recruiter-application-job-selector">
        <label htmlFor="application-job">Select Job</label>

        <select
          id="application-job"
          value={jobId || ""}
          onChange={handleJobChange}
        >
          <option value="">Select a job</option>

          {Array.isArray(jobs) &&
            jobs.map((job) => (
              <option key={job._id} value={job._id}>
                {job.title}
              </option>
            ))}
        </select>
      </div>

      {!jobId && (
        <div className="recruiter-empty-state">
          <div className="recruiter-empty-icon">👥</div>

          <h3>Select a job</h3>

          <p>Select one of your jobs above to view its applications.</p>
        </div>
      )}

      {jobId && selectedJob && (
        <>
          <div className="recruiter-selected-job-banner">
            <div>
              <span>Applications for</span>

              <h2>{selectedJob.title}</h2>

              <p>{selectedJob.location || "Location not specified"}</p>
            </div>

            <button
              type="button"
              className="recruiter-view-button"
              onClick={() => navigate(`/recruiter/jobs/${selectedJob._id}`)}
            >
              View Job
            </button>
          </div>

          <div className="recruiter-application-stats">
            <div>
              <span>Total</span>
              <strong>{applicationStats.total}</strong>
            </div>

            <div>
              <span>Pending</span>
              <strong>{applicationStats.pending}</strong>
            </div>

            <div>
              <span>Reviewing</span>
              <strong>{applicationStats.reviewing}</strong>
            </div>

            <div>
              <span>Shortlisted</span>
              <strong>{applicationStats.shortlisted}</strong>
            </div>

            <div>
              <span>Accepted</span>
              <strong>{applicationStats.accepted}</strong>
            </div>

            <div>
              <span>Rejected</span>
              <strong>{applicationStats.rejected}</strong>
            </div>
          </div>

          {showStatusForm && selectedApplication && (
            <div className="recruiter-status-form-card">
              <div className="recruiter-status-form-header">
                <div>
                  <h2>Update Application</h2>

                  <p>{selectedApplication.candidate?.name}</p>
                </div>
              </div>

              <ApplicationStatusForm
                application={selectedApplication}
                onSubmit={handleUpdateStatus}
                onCancel={() => {
                  setShowStatusForm(false);
                  setSelectedApplication(null);
                }}
                isSubmitting={isSubmitting}
              />
            </div>
          )}

          {applicationsLoading ? (
            <div className="recruiter-loading">Loading applications...</div>
          ) : (
            <ApplicationList
              applications={applications}
              onView={handleViewApplication}
              onStatusChange={handleStatusChange}
            />
          )}
        </>
      )}
    </div>
  );
};

export default ApplicationsManagement;
