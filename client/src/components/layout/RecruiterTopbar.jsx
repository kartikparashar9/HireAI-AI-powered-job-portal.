import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const pageTitles = {
  "/recruiter/dashboard": {
    title: "Dashboard",
    subtitle: "Overview of your recruitment activity",
  },

  "/recruiter/company": {
    title: "Company",
    subtitle: "Manage your company profile",
  },

  "/recruiter/jobs": {
    title: "Jobs",
    subtitle: "Manage your job postings",
  },

  "/recruiter/applications": {
    title: "Applicants",
    subtitle: "Review and manage candidates",
  },

  "/recruiter/interviews": {
    title: "Interviews",
    subtitle: "Manage your candidate interviews",
  },

  "/recruiter/profile": {
    title: "My Profile",
    subtitle: "Manage your recruiter profile",
  },
};

const RecruiterTopbar = ({ onMenuClick }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);

  const currentPage = pageTitles[location.pathname];

  let title = currentPage?.title || "Recruiter";
  let subtitle = currentPage?.subtitle || "Manage your recruitment workspace";

  if (location.pathname.startsWith("/recruiter/jobs/")) {
    title = "Job Details";
    subtitle = "View and manage this job posting";
  }

  if (location.pathname.startsWith("/recruiter/applications/")) {
    title = "Application Details";
    subtitle = "Review candidate application";
  }

  if (location.pathname.startsWith("/recruiter/interviews/")) {
    title = "Interview Details";
    subtitle = "View interview information";
  }

  const handleProfileClick = () => {
    navigate("/recruiter/profile");
  };

  return (
    <header className="recruiter-topbar">
      <div className="recruiter-topbar-left">
        <button
          type="button"
          className="recruiter-menu-button"
          onClick={onMenuClick}
          aria-label="Open navigation"
        >
          ☰
        </button>

        <div className="recruiter-topbar-heading">
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>
      </div>

      <div className="recruiter-topbar-right">
        <button
          type="button"
          className="recruiter-notification-button"
          aria-label="Notifications"
        >
          ♢
          <span className="recruiter-notification-dot" />
        </button>

        <button
          type="button"
          className="recruiter-topbar-profile"
          onClick={handleProfileClick}
        >
          <div className="recruiter-topbar-avatar">
            {user?.avatar ? (
              <img src={user.avatar} alt={user?.name || "Recruiter"} />
            ) : (
              (user?.name || "R").charAt(0).toUpperCase()
            )}
          </div>

          <div className="recruiter-topbar-user">
            <strong>{user?.name || "Recruiter"}</strong>

            <span>Recruiter</span>
          </div>

          <span className="recruiter-profile-arrow">▾</span>
        </button>
      </div>
    </header>
  );
};

export default RecruiterTopbar;
