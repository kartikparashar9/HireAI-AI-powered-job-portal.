import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

import { ROLES } from "../utils/constants";

const PublicOnlyRoute = () => {
  const { isAuthenticated, isInitialized, user } = useSelector(
    (state) => state.auth,
  );

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
     ALREADY AUTHENTICATED
  --------------------------------------------- */

  if (isAuthenticated) {
    switch (user?.role) {
      case ROLES.ADMIN:
        return <Navigate to="/admin/dashboard" replace />;

      case ROLES.RECRUITER:
        return <Navigate to="/recruiter/dashboard" replace />;

      case ROLES.JOB_SEEKER:
      default:
        return <Navigate to="/dashboard" replace />;
    }
  }

  /* ---------------------------------------------
     NOT AUTHENTICATED
  --------------------------------------------- */

  return <Outlet />;
};

export default PublicOnlyRoute;
