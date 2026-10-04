import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "../../layouts/JobSeekerLayout.css";

const JobSeekerTopbar = ({ onToggleSidebar }) => {
  const navigate = useNavigate();

  const user = useSelector((state) => state?.auth?.user) || {
    name: "User",
  };

  const initials =
    user?.name
      ?.trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((name) => name.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase() || "JS";

  return (
    <header className="job-seeker-topbar">
      {/* LEFT */}

      <div className="topbar-left">
        <button
          type="button"
          className="topbar-menu-btn"
          onClick={onToggleSidebar}
          aria-label="Open sidebar menu"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </div>

      {/* RIGHT */}

      <div className="topbar-actions">
        {/* NOTIFICATIONS */}

        <button
          type="button"
          className="topbar-notification"
          aria-label="Notifications"
          onClick={() => navigate("/notifications")}
        >
          <svg
            width="19"
            height="19"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
            <path d="M10 21h4" />
          </svg>

          <span className="notification-dot" />
        </button>

        {/* PROFILE */}

        <button
          type="button"
          className="topbar-profile"
          onClick={() => navigate("/profile")}
        >
          <div className="topbar-avatar">
            {user?.avatar ? (
              <img src={user.avatar} alt={user?.name || "User"} />
            ) : (
              initials
            )}
          </div>

          <div className="topbar-user-info">
            <strong>{user?.name || "User"}</strong>

            <span>Job Seeker</span>
          </div>

          <svg
            className="topbar-chevron"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>
      </div>
    </header>
  );
};

export default JobSeekerTopbar;
