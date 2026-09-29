import { Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";

import ProtectedRoute from "./ProtectedRoute";
import RoleProtectedRoute from "./RoleProtectedRoute";

import Home from "../pages/public/Home";
import NotFound from "../pages/public/NotFound";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import VerifyEmail from "../pages/auth/VerifyEmail";

import { ROLES } from "../utils/constants";

const Placeholder = ({ title }) => {
  return (
    <div className="page-placeholder">
      <h1>{title}</h1>
      <p>This page will be implemented in the next step.</p>
    </div>
  );
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* PUBLIC */}

      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/jobs" element={<Placeholder title="Jobs" />} />
      </Route>

      {/* AUTH */}

      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/verify-email" element={<VerifyEmail />} />

        <Route
          path="/forgot-password"
          element={<Placeholder title="Forgot Password" />}
        />

        <Route
          path="/reset-password"
          element={<Placeholder title="Reset Password" />}
        />
      </Route>

      {/* JOB SEEKER */}

      <Route element={<ProtectedRoute />}>
        <Route
          element={<RoleProtectedRoute allowedRoles={[ROLES.JOB_SEEKER]} />}
        >
          <Route
            path="/dashboard"
            element={<Placeholder title="Job Seeker Dashboard" />}
          />
        </Route>
      </Route>

      {/* RECRUITER */}

      <Route element={<ProtectedRoute />}>
        <Route
          element={<RoleProtectedRoute allowedRoles={[ROLES.RECRUITER]} />}
        >
          <Route
            path="/recruiter/dashboard"
            element={<Placeholder title="Recruiter Dashboard" />}
          />
        </Route>
      </Route>

      {/* ADMIN */}

      <Route element={<ProtectedRoute />}>
        <Route element={<RoleProtectedRoute allowedRoles={[ROLES.ADMIN]} />}>
          <Route
            path="/admin/dashboard"
            element={<Placeholder title="Admin Dashboard" />}
          />
        </Route>
      </Route>

      {/* FALLBACK */}

      <Route
        path="/unauthorized"
        element={<Placeholder title="Unauthorized" />}
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
