import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { logoutUser } from "../../features/auth/authSlice";

const navigationItems = [
  {
    label: "Dashboard",
    path: "/recruiter/dashboard",
    icon: "▦",
  },
  {
    label: "Company",
    path: "/recruiter/company",
    icon: "▣",
  },
  {
    label: "Jobs",
    path: "/recruiter/jobs",
    icon: "◫",
  },
  {
    label: "Applicants",
    path: "/recruiter/applications",
    icon: "◉",
  },
  {
    label: "Interviews",
    path: "/recruiter/interviews",
    icon: "◷",
  },
];

const RecruiterSidebar = ({ isOpen = false, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      navigate("/login", { replace: true });
    } catch (error) {
      // Even if backend logout fails, don't keep the user
      // stuck inside the recruiter dashboard.
      navigate("/login", { replace: true });
    }
  };

  return (
    <aside
      className={`recruiter-sidebar ${isOpen ? "recruiter-sidebar-open" : ""}`}
    >
      {/* LOGO / BRAND */}
      <div className="recruiter-sidebar-brand">
        <NavLink
          to="/recruiter/dashboard"
          className="recruiter-brand-link"
          onClick={onClose}
        >
          <div className="recruiter-brand-logo">H</div>

          <div className="recruiter-brand-text">
            <strong>HireAI</strong>
            <span>Recruiter</span>
          </div>
        </NavLink>

        <button
          type="button"
          className="recruiter-sidebar-close"
          aria-label="Close sidebar"
          onClick={onClose}
        >
          ×
        </button>
      </div>

      {/* RECRUITER INFO */}
      <div className="recruiter-sidebar-user">
        <div className="recruiter-sidebar-avatar">
          {user?.avatar ? (
            <img src={user.avatar} alt={user?.name || "Recruiter"} />
          ) : (
            (user?.name || "R").charAt(0).toUpperCase()
          )}
        </div>

        <div className="recruiter-sidebar-user-info">
          <strong>{user?.name || "Recruiter"}</strong>
          <span>Recruiter</span>
        </div>
      </div>

      {/* NAVIGATION */}
      <nav className="recruiter-sidebar-nav">
        <p className="recruiter-sidebar-section-title">Recruitment</p>

        {navigationItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onClose}
            className={({ isActive }) =>
              `recruiter-sidebar-link ${
                isActive ? "recruiter-sidebar-link-active" : ""
              }`
            }
          >
            <span className="recruiter-sidebar-link-icon">{item.icon}</span>

            <span>{item.label}</span>
          </NavLink>
        ))}

        <p className="recruiter-sidebar-section-title recruiter-sidebar-section-spaced">
          Account
        </p>

        <NavLink
          to="/recruiter/profile"
          onClick={onClose}
          className={({ isActive }) =>
            `recruiter-sidebar-link ${
              isActive ? "recruiter-sidebar-link-active" : ""
            }`
          }
        >
          <span className="recruiter-sidebar-link-icon">◉</span>
          <span>My Profile</span>
        </NavLink>
      </nav>

      {/* BOTTOM */}
      <div className="recruiter-sidebar-bottom">
        <button
          type="button"
          className="recruiter-sidebar-logout"
          onClick={handleLogout}
        >
          <span className="recruiter-sidebar-link-icon">↪</span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default RecruiterSidebar;
