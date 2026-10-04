import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ApplicationCard from "../../features/applications/components/ApplicationCard";

import {
  fetchMyApplications,
  selectApplications,
  selectApplicationsLoading,
  selectApplicationError,
  selectApplicationSuccess,
  clearApplicationSuccess,
} from "../../features/applications/applicationSlice";

import "./Application.css";

const Applications = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const applications = useSelector(selectApplications);
  const isLoading = useSelector(selectApplicationsLoading);
  const error = useSelector(selectApplicationError);
  const successMessage = useSelector(selectApplicationSuccess);

  useEffect(() => {
    dispatch(fetchMyApplications());
  }, [dispatch]);

  useEffect(() => {
    if (!successMessage) return;

    const timer = setTimeout(() => {
      dispatch(clearApplicationSuccess());
    }, 3500);

    return () => clearTimeout(timer);
  }, [successMessage, dispatch]);

  if (isLoading) {
    return (
      <div className="applications-page">
        <div className="applications-loading">
          <div className="application-skeleton" />
          <div className="application-skeleton" />
          <div className="application-skeleton" />
        </div>
      </div>
    );
  }

  return (
    <div className="applications-page">
      <header className="applications-header">
        <div>
          <span className="applications-eyebrow">Career Journey</span>

          <h1>My Applications</h1>

          <p>
            Track your job applications and monitor their progress from one
            place.
          </p>
        </div>

        <div className="applications-count">
          <strong>{applications.length}</strong>
          <span>Total Applications</span>
        </div>
      </header>

      {successMessage && (
        <div className="applications-success">{successMessage}</div>
      )}

      {error && (
        <div className="applications-error">
          <div>
            <strong>Unable to load applications</strong>
            <p>{error}</p>
          </div>

          <button type="button" onClick={() => dispatch(fetchMyApplications())}>
            Try Again
          </button>
        </div>
      )}

      {!error && applications.length === 0 && (
        <div className="applications-empty">
          <div className="applications-empty-icon">📄</div>

          <h2>No applications yet</h2>

          <p>
            Jobs you apply to will appear here so you can track their status.
          </p>

          <button type="button" onClick={() => navigate("/jobs")}>
            Browse Jobs
          </button>
        </div>
      )}

      {!error && applications.length > 0 && (
        <section className="applications-list">
          {applications.map((application) => (
            <ApplicationCard key={application._id} application={application} />
          ))}
        </section>
      )}
    </div>
  );
};

export default Applications;
