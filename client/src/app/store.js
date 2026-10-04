import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../features/auth/authSlice";
import jobsReducer from "../features/jobs/jobSlice";
import savedJobsReducer from "../features/savedJobs/savedJobSlice";
import profileReducer from "../features/profile/profileSlice";
import resumeReducer from "../features/resume/resumeSlice";
import applicationReducer from "../features/applications/applicationSlice";
import interviewReducer from "../features/interviews/interviewSlice";
import aiReducer from "../features/ai/aiSlice";
import recruiterReducer from "../features/recruiter/recruiterSlice";
import adminReducer from "../features/admin/adminSlice";
import notificationReducer from "../features/notifications/notificationSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    jobs: jobsReducer,
    savedJobs: savedJobsReducer,
    profile: profileReducer,
    resume: resumeReducer,
    applications: applicationReducer,
    interviews: interviewReducer,
    ai: aiReducer,
    recruiter: recruiterReducer,
    admin: adminReducer,
    notification: notificationReducer
  },

  devTools: import.meta.env.DEV,
});
