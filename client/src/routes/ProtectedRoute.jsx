import { Navigate, Outlet, useLocation } from "react-router-dom";

import useAuth from "../hooks/useAuth";

const ProtectedRoute = () => {
  const { isAuthenticated, isInitialized } = useAuth();

  const location = useLocation();

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
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location,
        }}
      />
    );
  }

  /* ---------------------------------------------
     AUTHENTICATED
  --------------------------------------------- */

  return <Outlet />;
};

export default ProtectedRoute;
