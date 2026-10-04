import { Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";

import ProtectedRoute from "./ProtectedRoute";
import PublicOnlyRoute from "./PublicOnlyRoute";
import RoleProtectedRoute from "./RoleProtectedRoute";

import Home from "../pages/public/Home";
import Jobs from "../pages/public/Jobs";
import NotFound from "../pages/public/NotFound";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import VerifyEmail from "../pages/auth/VerifyEmail";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";

// =========================================================
// JOB SEEKER ROUTES
// =========================================================

import JobSeekerLayout from "../layouts/JobSeekerLayout";
import Dashboard from "../pages/jobSeeker/Dashboard";
import SavedJobs from "../pages/jobSeeker/SavedJobs";
import JobDetails from "../pages/jobSeeker/JobDetailsPage";
import Profile from "../pages/jobSeeker/Profile";
import Resume from "../pages/jobSeeker/Resume";
import Application from "../pages/jobSeeker/Applications";
import ApplyJobPage from "../pages/jobSeeker/ApplyJobPage";
import ApplicationDetailsPage from "../pages/jobSeeker/ApplicationDetailsPage";
import InterviewsPage from "../pages/jobSeeker/Interviews";
import InterviewDetailsPage from "../pages/jobSeeker/InterviewDetailsPage";
import Notifications from "../pages/jobSeeker/Notifications";
import AICareerPage from "../pages/jobSeeker/AICareerPage";
import AIAnswer from "../features/ai/pages/AIAnswer";

// =========================================================
// RECRUITER ROUTES
// =========================================================

import RecruiterLayout from "../layouts/RecruiterLayout";
import RecruiterProfile from "../features/recruiter/pages/RecruiterProfile";
import RecruiterDashboard from "../pages/recruiter/Dashboard";
import RecruiterInterviews from "../pages/recruiter/Interviews";
import RecruiterJobs from "../pages/recruiter/Jobs";
import RecruiterJobDetails from "../features/recruiter/pages/JobDetails";
import RecruiterCompany from "../pages/recruiter/Company";
import RecruiterApplication from "../pages/recruiter/Applicants";
import RecruiterApplicationDetails from "../features/recruiter/pages/ApplicationDetails";
import RecruiterInterviewDetails from "../features/recruiter/pages/InterviewDetails";

// =========================================================
// ADMIN
// =========================================================

import AdminLayout from "../layouts/AdminLayout";
import AdminDashboard from "../pages/admin/Dashboard";
import UsersManagement from "../pages/admin/Users";
import RecruitersManagement from "../pages/admin/Recruiters";
import CompaniesManagement from "../pages/admin/Companies";

// =========================================================
// CONSTANTS
// =========================================================

import { ROLES } from "../utils/constants";

// =========================================================
// APP ROUTES
// =========================================================

const AppRoutes = () => {
  return (
    <Routes>
      {/* =================================================
          PUBLIC ROUTES
      ================================================= */}

      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/jobs" element={<Jobs />} />
      </Route>

      {/* =================================================
          AUTH ROUTES
      ================================================= */}

      <Route element={<PublicOnlyRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>
      </Route>

      {/* =================================================
          JOB SEEKER ROUTES
      ================================================= */}

      <Route element={<ProtectedRoute />}>
        <Route
          element={<RoleProtectedRoute allowedRoles={[ROLES.JOB_SEEKER]} />}
        >
          <Route element={<JobSeekerLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/jobs/:id" element={<JobDetails />} />
            <Route path="/saved-jobs" element={<SavedJobs />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/resume" element={<Resume />} />
            <Route path="/applications" element={<Application />} />
            <Route path="/jobs/:id/apply" element={<ApplyJobPage />} />
            <Route
              path="/jobseeker/applications/:id"
              element={<ApplicationDetailsPage />}
            />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/interviews" element={<InterviewsPage />} />
            <Route
              path="/jobseeker/interviews/:id"
              element={<InterviewDetailsPage />}
            />
            <Route path="/ai-career" element={<AICareerPage />} />
            <Route path="/jobseeker/ai/answer" element={<AIAnswer />} />
          </Route>
        </Route>
      </Route>

      {/* =================================================
          RECRUITER ROUTES
      ================================================= */}

      <Route element={<ProtectedRoute />}>
        <Route
          element={<RoleProtectedRoute allowedRoles={[ROLES.RECRUITER]} />}
        >
          <Route element={<RecruiterLayout />}>
            <Route
              path="/recruiter/dashboard"
              element={<RecruiterDashboard />}
            />

            <Route path="/recruiter/profile" element={<RecruiterProfile />} />
            <Route path="/recruiter/company" element={<RecruiterCompany />} />
            <Route path="/recruiter/jobs" element={<RecruiterJobs />} />
            <Route
              path="/recruiter/jobs/:id"
              element={<RecruiterJobDetails />}
            />
            <Route
              path="/recruiter/applications"
              element={<RecruiterApplication />}
            />
            <Route
              path="/recruiter/applications/:id"
              element={<RecruiterApplicationDetails />}
            />
            <Route
              path="/recruiter/interviews"
              element={<RecruiterInterviews />}
            />
            <Route
              path="/recruiter/interviews/:interviewId"
              element={<RecruiterInterviewDetails />}
            />
          </Route>
        </Route>
      </Route>

      {/* =================================================
          ADMIN ROUTES
      ================================================= */}

      <Route element={<ProtectedRoute />}>
        <Route element={<RoleProtectedRoute allowedRoles={[ROLES.ADMIN]} />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<UsersManagement />} />
            <Route
              path="/admin/recruiters"
              element={<RecruitersManagement />}
            />
            <Route path="/admin/companies" element={<CompaniesManagement />} />
          </Route>
        </Route>
      </Route>

      {/* =================================================
          UNAUTHORIZED
      ================================================= */}

      <Route
        path="/unauthorized"
        element={
          <div className="page-placeholder">
            <h1>Unauthorized</h1>
            <p>You do not have permission to access this page.</p>
          </div>
        }
      />

      {/* =================================================
          404
      ================================================= */}

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
