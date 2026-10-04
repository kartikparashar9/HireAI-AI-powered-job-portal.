import React from "react";
import { NavLink } from "react-router-dom";

/* =========================================================
   ICONS
========================================================= */

const Icon = ({ type }) => {
  const commonProps = {
    width: 20,
    height: 20,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true",
  };

  switch (type) {
    case "arrow":
      return (
        <svg {...commonProps}>
          <path d="M19 12H5" />
          <path d="m12 19-7-7 7-7" />
        </svg>
      );

    case "dashboard":
      return (
        <svg {...commonProps}>
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      );

    case "jobs":
      return (
        <svg {...commonProps}>
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-4-4" />
        </svg>
      );

    case "saved":
      return (
        <svg {...commonProps}>
          <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1Z" />
        </svg>
      );

    case "applications":
      return (
        <svg {...commonProps}>
          <rect x="4" y="3" width="16" height="18" rx="2" />
          <path d="M8 8h8M8 12h8M8 16h5" />
        </svg>
      );

    case "interviews":
      return (
        <svg {...commonProps}>
          <rect x="3" y="4" width="18" height="17" rx="2" />
          <path d="M16 2v4M8 2v4M3 9h18" />
          <path d="M8 13h3M8 17h5" />
        </svg>
      );

    case "profile":
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21a8 8 0 0 1 16 0" />
        </svg>
      );

    case "resume":
      return (
        <svg {...commonProps}>
          <path d="M6 3h9l3 3v15H6z" />
          <path d="M14 3v4h4M9 12h6M9 16h6" />
        </svg>
      );

    case "ai":
      return (
        <svg {...commonProps}>
          <path d="m12 2 1.6 6.4L20 10l-6.4 1.6L12 18l-1.6-6.4L4 10l6.4-1.6L12 2Z" />
          <path d="m19 16 .7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7L19 16Z" />
        </svg>
      );

    default:
      return null;
  }
};

/* =========================================================
   SIDEBAR
========================================================= */

const JobSeekerSidebar = ({ isOpen, onClose }) => {
  const navItems = [
    {
      label: "Back to Home",
      path: "/",
      icon: "arrow",
      end: true,
    },
    {
      label: "Dashboard",
      path: "/dashboard",
      icon: "dashboard",
      end: true,
    },
    {
      label: "Saved Jobs",
      path: "/saved-jobs",
      icon: "saved",
      end: true,
    },
    {
      label: "Applications",
      path: "/applications",
      icon: "applications",
      end: true,
    },
    {
      label: "Interviews",
      path: "/interviews",
      icon: "interviews",
      end: true,
    },
    {
      label: "My Profile",
      path: "/profile",
      icon: "profile",
      end: true,
    },
    {
      label: "Resume",
      path: "/resume",
      icon: "resume",
      end: true,
    },
    {
      label: "AI Career",
      path: "/ai-career",
      icon: "ai",
      end: true,
    },
  ];

  return (
    <aside
      className={`job-seeker-sidebar ${isOpen ? "sidebar-mobile-open" : ""}`}
    >
      {/* =====================================================
          BRAND
      ===================================================== */}

      <div className="sidebar-brand-wrapper">
        <NavLink
          to="/dashboard"
          className="sidebar-brand"
          onClick={onClose}
          aria-label="HireAI Dashboard"
        >
          <div className="sidebar-brand-mark">
            <svg
              width="21"
              height="21"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="3" y="7" width="18" height="13" rx="2" />

              <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />

              <path d="M3 12h18" />

              <path d="M10 12v2h4v-2" />
            </svg>
          </div>

          <span className="sidebar-brand-text">
            Hire<span>AI</span>
          </span>
        </NavLink>

        {/* ===================================================
            MOBILE CLOSE BUTTON
        =================================================== */}

        <button
          type="button"
          className="sidebar-close-btn"
          onClick={onClose}
          aria-label="Close sidebar"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* =====================================================
          NAVIGATION
      ===================================================== */}

      <nav className="sidebar-nav" aria-label="Job seeker navigation">
        <p className="sidebar-section-title">WORKSPACE</p>

        <div className="sidebar-nav-list">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              onClick={onClose}
              className={({ isActive }) =>
                `sidebar-nav-item ${isActive ? "sidebar-nav-item-active" : ""}`
              }
            >
              <span className="sidebar-nav-icon">
                <Icon type={item.icon} />
              </span>

              <span className="sidebar-nav-label">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      {/* =====================================================
          AI CAREER CARD
      ===================================================== */}

      <div className="sidebar-footer">
        <div className="sidebar-ai-card">
          <div className="sidebar-ai-icon">
            <Icon type="ai" />
          </div>

          <div className="sidebar-ai-content">
            <strong>AI Career Coach</strong>

            <p>Get personalized career guidance.</p>

            <NavLink to="/ai-career" onClick={onClose}>
              Explore AI →
            </NavLink>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default JobSeekerSidebar;
