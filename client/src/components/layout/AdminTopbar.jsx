import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const AdminTopbar = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const authUser = useSelector((state) => state.auth?.user);

  const getPageTitle = () => {
    if (location.pathname === "/admin") {
      return {
        title: "Dashboard",
        description: "Overview of your HireAI platform",
      };
    }

    if (location.pathname.startsWith("/admin/users")) {
      return {
        title: "Users",
        description: "Manage registered users",
      };
    }

    if (location.pathname.startsWith("/admin/recruiters")) {
      return {
        title: "Recruiters",
        description: "Manage recruiter accounts",
      };
    }

    if (location.pathname.startsWith("/admin/companies")) {
      return {
        title: "Companies",
        description: "Manage registered companies",
      };
    }

    return {
      title: "Admin",
      description: "HireAI administration",
    };
  };

  const page = getPageTitle();

  const adminName = authUser?.name || "Admin";

  const adminEmail = authUser?.email || "";

  const adminInitial = adminName.charAt(0).toUpperCase();

  return (
    <header className="admin-topbar">
      <div className="admin-topbar__left">
        <button
          type="button"
          className="admin-topbar__menu"
          onClick={onMenuClick}
          aria-label="Open admin menu"
        >
          <span />
          <span />
          <span />
        </button>

        <div className="admin-topbar__heading">
          <h1>{page.title}</h1>

          <p>{page.description}</p>
        </div>
      </div>

      <div className="admin-topbar__right">
        {/* HOME */}
        <button
          type="button"
          className="admin-topbar__icon-button"
          onClick={() => navigate("/")}
          aria-label="Go to website"
          title="Go to website"
        >
          ↗
        </button>

        {/* PROFILE */}
        <div className="admin-topbar__profile">
          <div className="admin-topbar__avatar">
            {authUser?.avatar ? (
              <img src={authUser.avatar} alt={adminName} />
            ) : (
              adminInitial
            )}
          </div>

          <div className="admin-topbar__profile-info">
            <strong>{adminName}</strong>

            <span>{adminEmail || "Administrator"}</span>
          </div>

          <span className="admin-topbar__profile-arrow">▾</span>
        </div>
      </div>
    </header>
  );
};

export default AdminTopbar;
