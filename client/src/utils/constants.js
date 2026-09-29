export const APP_NAME = import.meta.env.VITE_APP_NAME || "HireAI";

export const ROLES = {
  JOB_SEEKER: "JOB_SEEKER",
  RECRUITER: "RECRUITER",
  ADMIN: "ADMIN",
};

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  JOBS: "/jobs",
  JOB_DETAILS: "/jobs/:jobId",
  VERIFY_EMAIL: "/verify-email",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",

  JOB_SEEKER_DASHBOARD: "/dashboard",
  RECRUITER_DASHBOARD: "/recruiter/dashboard",
  ADMIN_DASHBOARD: "/admin/dashboard",
};