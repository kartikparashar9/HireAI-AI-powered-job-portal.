import { Navigate, Outlet } from "react-router-dom";

import useAuth from "../hooks/useAuth";
import { ROLES } from "../utils/constants";

const RoleProtectedRoute = ({ allowedRoles = [] }) => {
  const { user, isAuthenticated, isInitialized } = useAuth();

  /* ---------------------------------------------
     AUTH INITIALIZATION
  --------------------------------------------- */

  if (!isInitialized) {
    return (
      <div className="route-loader">
        <div className="route-loader-spinner" />
        <p>Loading HireAI...</p>
      </div>
    );
  }

  /* ---------------------------------------------
     NOT AUTHENTICATED
  --------------------------------------------- */

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  /* ---------------------------------------------
     USER NOT AVAILABLE
  --------------------------------------------- */

  if (!user) {
    return <Navigate to="/unauthorized" replace />;
  }

  /* ---------------------------------------------
     ROLE CHECK
  --------------------------------------------- */

  const hasAllowedRole = allowedRoles.includes(user.role);

  if (!hasAllowedRole) {
    switch (user.role) {
      case ROLES.ADMIN:
        return <Navigate to="/admin/dashboard" replace />;

      case ROLES.RECRUITER:
        return <Navigate to="/recruiter/dashboard" replace />;

      case ROLES.JOB_SEEKER:
        return <Navigate to="/" replace />;

      default:
        return <Navigate to="/unauthorized" replace />;
    }
  }

  /* ---------------------------------------------
     AUTHENTICATED + AUTHORIZED
  --------------------------------------------- */

  return <Outlet />;
};

export default RoleProtectedRoute;

