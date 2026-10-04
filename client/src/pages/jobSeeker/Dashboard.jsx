import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state?.auth?.user) || {
    name: "Pragyesh",
  };

  const firstName = user?.name?.split(" ")[0] || "there";

  return (
    <div className="dashboard-page">
      {/* HEADER */}
      <div className="dashboard-header">
        <div>
          <span className="dashboard-eyebrow">JOB SEEKER DASHBOARD</span>
          <h1>Welcome back, {firstName}!</h1>
          <p>Track your job search and move your career forward.</p>
        </div>
      </div>

      {/* STATS */}
      <div className="dashboard-stats">
        <div
          className="dashboard-stat-card"
          onClick={() => navigate("/applications")}
        >
          <div className="stat-card-top">
            <span>Applications</span>
            <div className="stat-icon">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path d="M6 3h12v18H6z" />
                <path d="M9 7h6M9 11h6M9 15h4" />
              </svg>
            </div>
          </div>
          <strong>4</strong>
          <small>Total applications</small>
        </div>

        <div
          className="dashboard-stat-card"
          onClick={() => navigate("/saved-jobs")}
        >
          <div className="stat-card-top">
            <span>Saved Jobs</span>
            <div className="stat-icon">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1Z" />
              </svg>
            </div>
          </div>
          <strong>3</strong>
          <small>Jobs saved for later</small>
        </div>

        <div
          className="dashboard-stat-card"
          onClick={() => navigate("/interviews")}
        >
          <div className="stat-card-top">
            <span>Interviews</span>
            <div className="stat-icon">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <rect x="3" y="4" width="18" height="17" rx="2" />
                <path d="M8 2v4M16 2v4M3 9h18" />
              </svg>
            </div>
          </div>
          <strong>2</strong>
          <small>Upcoming interviews</small>
        </div>

        <div
          className="dashboard-stat-card"
          onClick={() => navigate("/profile")}
        >
          <div className="stat-card-top">
            <span>Profile</span>
            <div className="stat-icon">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21a8 8 0 0 1 16 0" />
              </svg>
            </div>
          </div>
          <strong>60%</strong>
          <small>Profile completion</small>
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="dashboard-grid">
        {/* RECOMMENDED JOBS */}
        <section className="dashboard-section">
          <div className="dashboard-section-header">
            <div>
              <h2>Recommended Jobs</h2>
              <p>Opportunities based on your profile.</p>
            </div>
            <button type="button" onClick={() => navigate("/jobs")}>
              View all
            </button>
          </div>

          <div className="dashboard-empty-card">
            <div className="dashboard-empty-icon">✦</div>
            <h3>Personalized recommendations are ready</h3>
            <p>
              Complete your profile and resume to get higher accuracy AI job
              matches.
            </p>
            <button
              type="button"
              className="dashboard-primary-button"
              onClick={() => navigate("/jobs")}
            >
              Explore Matches
            </button>
          </div>
        </section>

        {/* PROFILE COMPLETION */}
        <section className="dashboard-section">
          <div className="dashboard-section-header">
            <div>
              <h2>Profile Completion</h2>
              <p>Complete your profile to improve matching.</p>
            </div>
          </div>

          <div className="profile-card">
            <div className="profile-progress-header">
              <strong>60% complete</strong>
              <span>3 / 5 sections</span>
            </div>

            <div className="profile-progress">
              <div className="profile-progress-bar" style={{ width: "60%" }} />
            </div>

            <div className="profile-checklist">
              <div className="checklist-done">
                <span>✓</span> Basic Information
              </div>
              <div className="checklist-done">
                <span>✓</span> Skills & Frameworks
              </div>
              <div className="checklist-done">
                <span>✓</span> Experience
              </div>
              <div>
                <span>○</span> Education
              </div>
              <div>
                <span>○</span> Resume Upload
              </div>
            </div>

            <button
              type="button"
              className="dashboard-outline-button"
              onClick={() => navigate("/profile")}
            >
              Complete Profile
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
