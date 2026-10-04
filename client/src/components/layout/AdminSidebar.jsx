import { NavLink, useLocation } from "react-router-dom";

const AdminSidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  const navigationItems = [
    {
      label: "Dashboard",
      path: "/admin/dashboard",
      icon: "▦",
      exact: true,
    },
    {
      label: "Users",
      path: "/admin/users",
      icon: "♙",
    },
    {
      label: "Recruiters",
      path: "/admin/recruiters",
      icon: "▣",
    },
    {
      label: "Companies",
      path: "/admin/companies",
      icon: "▤",
    },
  ];

  const isDashboardActive = (item) => {
    if (item.exact) {
      return location.pathname === item.path;
    }

    return (
      location.pathname === item.path ||
      location.pathname.startsWith(`${item.path}/`)
    );
  };

  return (
    <aside className={`admin-sidebar ${isOpen ? "admin-sidebar--open" : ""}`}>
      {/* BRAND */}
      <div className="admin-sidebar__brand">
        <NavLink
          to="/admin"
          className="admin-sidebar__brand-link"
          onClick={onClose}
        >
          <div className="admin-sidebar__logo">H</div>

          <div className="admin-sidebar__brand-text">
            <span className="admin-sidebar__brand-name">HireAI</span>

            <span className="admin-sidebar__brand-label">Admin Panel</span>
          </div>
        </NavLink>

        <button
          type="button"
          className="admin-sidebar__mobile-close"
          onClick={onClose}
          aria-label="Close sidebar"
        >
          ×
        </button>
      </div>

      {/* NAVIGATION */}
      <nav className="admin-sidebar__nav">
        <div className="admin-sidebar__section-title">Management</div>

        {navigationItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onClose}
            className={() =>
              `admin-sidebar__nav-item ${
                isDashboardActive(item) ? "admin-sidebar__nav-item--active" : ""
              }`
            }
          >
            <span className="admin-sidebar__nav-icon">{item.icon}</span>

            <span className="admin-sidebar__nav-label">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* BOTTOM */}
      <div className="admin-sidebar__bottom">
        <div className="admin-sidebar__system-card">
          <div className="admin-sidebar__system-icon">✓</div>

          <div>
            <strong>System Online</strong>

            <span>HireAI services are active</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
