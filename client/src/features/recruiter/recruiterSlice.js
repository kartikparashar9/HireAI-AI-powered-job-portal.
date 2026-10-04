import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import recruiterApi from "./api/recruiterApi";

// =====================================================
// HELPERS
// =====================================================

const getResponseData = (response) => {
  return response?.data?.data ?? response?.data ?? response;
};

const getErrorMessage = (error) => {
  const responseData = error?.response?.data;

  if (Array.isArray(responseData?.errors) && responseData.errors.length) {
    return responseData.errors
      .map((item) => {
        const field = item?.field || item?.path || "field";
        const message = item?.message || "Invalid value";

        return `${field}: ${message}`;
      })
      .join(", ");
  }

  return responseData?.message || error?.message || "Something went wrong";
};

// =====================================================
// PROFILE THUNKS
// =====================================================

export const fetchRecruiterProfile = createAsyncThunk(
  "recruiter/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await recruiterApi.getProfile();

      return getResponseData(response);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const createRecruiterProfile = createAsyncThunk(
  "recruiter/createProfile",
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await recruiterApi.createProfile(profileData);

      return getResponseData(response);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const updateRecruiterProfile = createAsyncThunk(
  "recruiter/updateProfile",
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await recruiterApi.updateProfile(profileData);

      return getResponseData(response);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

// =====================================================
// COMPANY THUNKS
// =====================================================

export const fetchMyCompany = createAsyncThunk(
  "recruiter/fetchMyCompany",
  async (_, { rejectWithValue }) => {
    try {
      const response = await recruiterApi.getMyCompany();

      return getResponseData(response);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const fetchCompanyById = createAsyncThunk(
  "recruiter/fetchCompanyById",
  async (companyId, { rejectWithValue }) => {
    try {
      const response = await recruiterApi.getCompanyById(companyId);

      return getResponseData(response);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const createCompany = createAsyncThunk(
  "recruiter/createCompany",
  async (companyData, { rejectWithValue }) => {
    try {
      const response = await recruiterApi.createCompany(companyData);

      return getResponseData(response);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const updateCompany = createAsyncThunk(
  "recruiter/updateCompany",
  async ({ companyId, companyData }, { rejectWithValue }) => {
    try {
      const response = await recruiterApi.updateCompany(companyId, companyData);

      return getResponseData(response);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const deleteCompany = createAsyncThunk(
  "recruiter/deleteCompany",
  async (companyId, { rejectWithValue }) => {
    try {
      const response = await recruiterApi.deleteCompany(companyId);

      return {
        companyId,
        data: getResponseData(response),
      };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

// =====================================================
// JOB THUNKS
// =====================================================

export const fetchMyJobs = createAsyncThunk(
  "recruiter/fetchMyJobs",
  async (_, { rejectWithValue }) => {
    try {
      const response = await recruiterApi.getMyJobs();

      return getResponseData(response);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const fetchJobById = createAsyncThunk(
  "recruiter/fetchJobById",
  async (jobId, { rejectWithValue }) => {
    try {
      const response = await recruiterApi.getJobById(jobId);

      return getResponseData(response);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const createJob = createAsyncThunk(
  "recruiter/createJob",
  async (jobData, { rejectWithValue }) => {
    try {
      const response = await recruiterApi.createJob(jobData);

      return getResponseData(response);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const updateJob = createAsyncThunk(
  "recruiter/updateJob",
  async ({ jobId, jobData }, { rejectWithValue }) => {
    try {
      const response = await recruiterApi.updateJob(jobId, jobData);

      return getResponseData(response);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const deleteJob = createAsyncThunk(
  "recruiter/deleteJob",
  async (jobId, { rejectWithValue }) => {
    try {
      const response = await recruiterApi.deleteJob(jobId);

      return {
        jobId,
        data: getResponseData(response),
      };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

// =====================================================
// APPLICATION THUNKS
// =====================================================

export const fetchJobApplications = createAsyncThunk(
  "recruiter/fetchJobApplications",
  async (jobId, { rejectWithValue }) => {
    try {
      const response = await recruiterApi.getJobApplications(jobId);

      const data = getResponseData(response);

      return {
        jobId,
        applications: Array.isArray(data)
          ? data
          : Array.isArray(data?.applications)
            ? data.applications
            : [],
      };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const fetchShortlistedApplications = createAsyncThunk(
  "recruiter/fetchShortlistedApplications",
  async (_, { rejectWithValue }) => {
    try {
      const response = await recruiterApi.getShortlistedApplications();

      const data = getResponseData(response);

      return Array.isArray(data)
        ? data
        : Array.isArray(data?.applications)
          ? data.applications
          : [];
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const updateApplicationStatus = createAsyncThunk(
  "recruiter/updateApplicationStatus",
  async (
    { applicationId, status, recruiterNote = "" },
    { rejectWithValue },
  ) => {
    try {
      const response = await recruiterApi.updateApplicationStatus(
        applicationId,
        {
          status,
          recruiterNote,
        },
      );

      return getResponseData(response);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

// =====================================================
// INTERVIEW THUNKS
// =====================================================

export const fetchMyInterviews = createAsyncThunk(
  "recruiter/fetchMyInterviews",
  async (_, { rejectWithValue }) => {
    try {
      const response = await recruiterApi.getMyInterviews();

      return getResponseData(response);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const fetchInterviewById = createAsyncThunk(
  "recruiter/fetchInterviewById",
  async (interviewId, { rejectWithValue }) => {
    try {
      const response = await recruiterApi.getInterviewById(interviewId);

      return getResponseData(response);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const createInterview = createAsyncThunk(
  "recruiter/createInterview",
  async (interviewData, { rejectWithValue }) => {
    try {
      const response = await recruiterApi.createInterview(interviewData);

      return getResponseData(response);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const updateInterview = createAsyncThunk(
  "recruiter/updateInterview",
  async ({ interviewId, interviewData }, { rejectWithValue }) => {
    try {
      const response = await recruiterApi.updateInterview(
        interviewId,
        interviewData,
      );

      return getResponseData(response);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const completeInterview = createAsyncThunk(
  "recruiter/completeInterview",
  async ({ interviewId, data = {} }, { rejectWithValue }) => {
    try {
      const response = await recruiterApi.completeInterview(interviewId, data);

      return getResponseData(response);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const cancelInterview = createAsyncThunk(
  "recruiter/cancelInterview",
  async ({ interviewId, data = {} }, { rejectWithValue }) => {
    try {
      const response = await recruiterApi.cancelInterview(interviewId, data);

      return getResponseData(response);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

// =====================================================
// INITIAL STATE
// =====================================================

const initialState = {
  // Profile
  profile: null,
  profileLoading: false,
  profileError: null,

  // Company
  company: null,
  companyLoading: false,
  companyError: null,

  // Jobs
  jobs: [],
  selectedJob: null,
  jobsLoading: false,
  jobLoading: false,
  jobsError: null,

  // Applications
  applications: [],
  applicationsByJob: {},
  applicationsLoading: false,
  applicationsError: null,

  // Shortlisted Applications
  shortlistedApplications: [],
  shortlistedApplicationsLoading: false,
  shortlistedApplicationsError: null,

  // Interviews
  interviews: [],
  selectedInterview: null,
  interviewsLoading: false,
  interviewLoading: false,
  interviewsError: null,

  // Global mutation state
  isSubmitting: false,
  successMessage: null,
  error: null,
};

// =====================================================
// SLICE
// =====================================================

const recruiterSlice = createSlice({
  name: "recruiter",
  initialState,

  reducers: {
    clearRecruiterError: (state) => {
      state.error = null;
      state.profileError = null;
      state.companyError = null;
      state.jobsError = null;
      state.applicationsError = null;
      state.shortlistedApplicationsError = null;
      state.interviewsError = null;
    },

    clearRecruiterSuccess: (state) => {
      state.successMessage = null;
    },

    clearSelectedJob: (state) => {
      state.selectedJob = null;
    },

    clearSelectedInterview: (state) => {
      state.selectedInterview = null;
    },

    clearApplications: (state) => {
      state.applications = [];
    },

    resetRecruiterState: () => {
      return initialState;
    },
  },

  extraReducers: (builder) => {
    // =================================================
    // PROFILE
    // =================================================

    builder

      // FETCH PROFILE
      .addCase(fetchRecruiterProfile.pending, (state) => {
        state.profileLoading = true;
        state.profileError = null;
      })

      .addCase(fetchRecruiterProfile.fulfilled, (state, action) => {
        state.profileLoading = false;
        state.profile = action.payload;
      })

      .addCase(fetchRecruiterProfile.rejected, (state, action) => {
        state.profileLoading = false;
        state.profileError = action.payload || "Failed to fetch profile";
      })

      // CREATE PROFILE
      .addCase(createRecruiterProfile.pending, (state) => {
        state.isSubmitting = true;
        state.profileError = null;
        state.error = null;
        state.successMessage = null;
      })

      .addCase(createRecruiterProfile.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.profile = action.payload;
        state.successMessage = "Profile created successfully";
      })

      .addCase(createRecruiterProfile.rejected, (state, action) => {
        state.isSubmitting = false;

        state.profileError = action.payload || "Failed to create profile";

        state.error = action.payload || "Failed to create profile";
      })

      // UPDATE PROFILE
      .addCase(updateRecruiterProfile.pending, (state) => {
        state.isSubmitting = true;
        state.profileError = null;
        state.error = null;
        state.successMessage = null;
      })

      .addCase(updateRecruiterProfile.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.profile = action.payload;
        state.successMessage = "Profile updated successfully";
      })

      .addCase(updateRecruiterProfile.rejected, (state, action) => {
        state.isSubmitting = false;

        state.profileError = action.payload || "Failed to update profile";

        state.error = action.payload || "Failed to update profile";
      });

    // =================================================
    // COMPANY
    // =================================================

    builder

      .addCase(fetchMyCompany.pending, (state) => {
        state.companyLoading = true;
        state.companyError = null;
      })

      .addCase(fetchMyCompany.fulfilled, (state, action) => {
        state.companyLoading = false;
        state.company = action.payload;
      })

      .addCase(fetchMyCompany.rejected, (state, action) => {
        state.companyLoading = false;
        state.companyError = action.payload;
      })

      .addCase(fetchCompanyById.pending, (state) => {
        state.companyLoading = true;
        state.companyError = null;
      })

      .addCase(fetchCompanyById.fulfilled, (state, action) => {
        state.companyLoading = false;
        state.company = action.payload;
      })

      .addCase(fetchCompanyById.rejected, (state, action) => {
        state.companyLoading = false;
        state.companyError = action.payload;
      })

      .addCase(createCompany.pending, (state) => {
        state.isSubmitting = true;
        state.companyError = null;
        state.error = null;
      })

      .addCase(createCompany.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.company = action.payload;
        state.successMessage = "Company created successfully";
      })

      .addCase(createCompany.rejected, (state, action) => {
        state.isSubmitting = false;
        state.companyError = action.payload;
        state.error = action.payload;
      })

      .addCase(updateCompany.pending, (state) => {
        state.isSubmitting = true;
        state.companyError = null;
        state.error = null;
      })

      .addCase(updateCompany.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.company = action.payload;
        state.successMessage = "Company updated successfully";
      })

      .addCase(updateCompany.rejected, (state, action) => {
        state.isSubmitting = false;
        state.companyError = action.payload;
        state.error = action.payload;
      })

      .addCase(deleteCompany.pending, (state) => {
        state.isSubmitting = true;
        state.companyError = null;
        state.error = null;
      })

      .addCase(deleteCompany.fulfilled, (state, action) => {
        state.isSubmitting = false;

        if (state.company?._id === action.payload.companyId) {
          state.company = null;
        }

        state.successMessage = "Company deleted successfully";
      })

      .addCase(deleteCompany.rejected, (state, action) => {
        state.isSubmitting = false;
        state.companyError = action.payload;
        state.error = action.payload;
      });

    // =================================================
    // JOBS
    // =================================================

    builder

      .addCase(fetchMyJobs.pending, (state) => {
        state.jobsLoading = true;
        state.jobsError = null;
      })

      .addCase(fetchMyJobs.fulfilled, (state, action) => {
        state.jobsLoading = false;

        state.jobs = Array.isArray(action.payload)
          ? action.payload
          : action.payload?.jobs || [];
      })

      .addCase(fetchMyJobs.rejected, (state, action) => {
        state.jobsLoading = false;
        state.jobsError = action.payload;
      })

      .addCase(fetchJobById.pending, (state) => {
        state.jobLoading = true;
        state.jobsError = null;
      })

      .addCase(fetchJobById.fulfilled, (state, action) => {
        state.jobLoading = false;
        state.selectedJob = action.payload;
      })

      .addCase(fetchJobById.rejected, (state, action) => {
        state.jobLoading = false;
        state.jobsError = action.payload;
      })

      .addCase(createJob.pending, (state) => {
        state.isSubmitting = true;
        state.jobsError = null;
        state.error = null;
      })

      .addCase(createJob.fulfilled, (state, action) => {
        state.isSubmitting = false;

        if (action.payload) {
          state.jobs.unshift(action.payload);
        }

        state.successMessage = "Job created successfully";
      })

      .addCase(createJob.rejected, (state, action) => {
        state.isSubmitting = false;
        state.jobsError = action.payload;
        state.error = action.payload;
      })

      .addCase(updateJob.pending, (state) => {
        state.isSubmitting = true;
        state.jobsError = null;
        state.error = null;
      })

      .addCase(updateJob.fulfilled, (state, action) => {
        state.isSubmitting = false;

        const updatedJob = action.payload;

        if (updatedJob?._id) {
          const index = state.jobs.findIndex(
            (job) => job._id === updatedJob._id,
          );

          if (index !== -1) {
            state.jobs[index] = updatedJob;
          }

          if (state.selectedJob?._id === updatedJob._id) {
            state.selectedJob = updatedJob;
          }
        }

        state.successMessage = "Job updated successfully";
      })

      .addCase(updateJob.rejected, (state, action) => {
        state.isSubmitting = false;
        state.jobsError = action.payload;
        state.error = action.payload;
      })

      .addCase(deleteJob.pending, (state) => {
        state.isSubmitting = true;
        state.jobsError = null;
        state.error = null;
      })

      .addCase(deleteJob.fulfilled, (state, action) => {
        state.isSubmitting = false;

        state.jobs = state.jobs.filter(
          (job) => job._id !== action.payload.jobId,
        );

        if (state.selectedJob?._id === action.payload.jobId) {
          state.selectedJob = null;
        }

        delete state.applicationsByJob[action.payload.jobId];

        state.successMessage = "Job deleted successfully";
      })

      .addCase(deleteJob.rejected, (state, action) => {
        state.isSubmitting = false;
        state.jobsError = action.payload;
        state.error = action.payload;
      });

    // =================================================
    // APPLICATIONS
    // =================================================

    builder

      .addCase(fetchJobApplications.pending, (state) => {
        state.applicationsLoading = true;
        state.applicationsError = null;
      })

      .addCase(fetchJobApplications.fulfilled, (state, action) => {
        state.applicationsLoading = false;

        const applications = Array.isArray(action.payload.applications)
          ? action.payload.applications
          : [];

        state.applications = applications;

        state.applicationsByJob[action.payload.jobId] = applications;
      })

      .addCase(fetchJobApplications.rejected, (state, action) => {
        state.applicationsLoading = false;
        state.applicationsError = action.payload;
      })

      // FETCH SHORTLISTED APPLICATIONS
      .addCase(fetchShortlistedApplications.pending, (state) => {
        state.shortlistedApplicationsLoading = true;
        state.shortlistedApplicationsError = null;
      })

      .addCase(fetchShortlistedApplications.fulfilled, (state, action) => {
        state.shortlistedApplicationsLoading = false;

        state.shortlistedApplications = Array.isArray(action.payload)
          ? action.payload
          : [];
      })

      .addCase(fetchShortlistedApplications.rejected, (state, action) => {
        state.shortlistedApplicationsLoading = false;

        state.shortlistedApplicationsError =
          action.payload || "Failed to fetch shortlisted applications";
      })

      .addCase(updateApplicationStatus.pending, (state) => {
        state.isSubmitting = true;
        state.applicationsError = null;
        state.error = null;
      })

      .addCase(updateApplicationStatus.fulfilled, (state, action) => {
        state.isSubmitting = false;

        const updatedApplication = action.payload;

        if (updatedApplication?._id) {
          const index = state.applications.findIndex(
            (application) => application._id === updatedApplication._id,
          );

          if (index !== -1) {
            state.applications[index] = updatedApplication;
          }

          Object.keys(state.applicationsByJob).forEach((jobId) => {
            const jobApplications = state.applicationsByJob[jobId];

            if (!Array.isArray(jobApplications)) {
              return;
            }

            const applicationIndex = jobApplications.findIndex(
              (application) => application._id === updatedApplication._id,
            );

            if (applicationIndex !== -1) {
              jobApplications[applicationIndex] = updatedApplication;
            }
          });

          const shortlistedIndex = state.shortlistedApplications.findIndex(
            (application) => application._id === updatedApplication._id,
          );

          if (shortlistedIndex !== -1) {
            if (updatedApplication.status === "SHORTLISTED") {
              state.shortlistedApplications[shortlistedIndex] =
                updatedApplication;
            } else {
              state.shortlistedApplications.splice(shortlistedIndex, 1);
            }
          } else if (updatedApplication.status === "SHORTLISTED") {
            state.shortlistedApplications.unshift(updatedApplication);
          }
        }

        state.successMessage = "Application status updated successfully";
      })

      .addCase(updateApplicationStatus.rejected, (state, action) => {
        state.isSubmitting = false;
        state.applicationsError = action.payload;
        state.error = action.payload;
      });

    // =================================================
    // INTERVIEWS
    // =================================================

    builder

      .addCase(fetchMyInterviews.pending, (state) => {
        state.interviewsLoading = true;
        state.interviewsError = null;
      })

      .addCase(fetchMyInterviews.fulfilled, (state, action) => {
        state.interviewsLoading = false;

        state.interviews = Array.isArray(action.payload)
          ? action.payload
          : action.payload?.interviews || [];
      })

      .addCase(fetchMyInterviews.rejected, (state, action) => {
        state.interviewsLoading = false;
        state.interviewsError = action.payload;
      })

      .addCase(fetchInterviewById.pending, (state) => {
        state.interviewLoading = true;
        state.interviewsError = null;
      })

      .addCase(fetchInterviewById.fulfilled, (state, action) => {
        state.interviewLoading = false;
        state.selectedInterview = action.payload;
      })

      .addCase(fetchInterviewById.rejected, (state, action) => {
        state.interviewLoading = false;
        state.interviewsError = action.payload;
      })

      .addCase(createInterview.pending, (state) => {
        state.isSubmitting = true;
        state.interviewsError = null;
        state.error = null;
      })

      .addCase(createInterview.fulfilled, (state, action) => {
        state.isSubmitting = false;

        if (action.payload) {
          state.interviews.push(action.payload);
        }

        state.successMessage = "Interview scheduled successfully";
      })

      .addCase(createInterview.rejected, (state, action) => {
        state.isSubmitting = false;
        state.interviewsError = action.payload;
        state.error = action.payload;
      })

      .addCase(updateInterview.pending, (state) => {
        state.isSubmitting = true;
        state.interviewsError = null;
        state.error = null;
      })

      .addCase(updateInterview.fulfilled, (state, action) => {
        state.isSubmitting = false;

        const updatedInterview = action.payload;

        if (updatedInterview?._id) {
          const index = state.interviews.findIndex(
            (interview) => interview._id === updatedInterview._id,
          );

          if (index !== -1) {
            state.interviews[index] = updatedInterview;
          }

          if (state.selectedInterview?._id === updatedInterview._id) {
            state.selectedInterview = updatedInterview;
          }
        }

        state.successMessage = "Interview updated successfully";
      })

      .addCase(updateInterview.rejected, (state, action) => {
        state.isSubmitting = false;
        state.interviewsError = action.payload;
        state.error = action.payload;
      })

      .addCase(completeInterview.pending, (state) => {
        state.isSubmitting = true;
        state.interviewsError = null;
        state.error = null;
      })

      .addCase(completeInterview.fulfilled, (state, action) => {
        state.isSubmitting = false;

        const completedInterview = action.payload;

        if (completedInterview?._id) {
          const index = state.interviews.findIndex(
            (interview) => interview._id === completedInterview._id,
          );

          if (index !== -1) {
            state.interviews[index] = completedInterview;
          }

          if (state.selectedInterview?._id === completedInterview._id) {
            state.selectedInterview = completedInterview;
          }
        }

        state.successMessage = "Interview completed successfully";
      })

      .addCase(completeInterview.rejected, (state, action) => {
        state.isSubmitting = false;
        state.interviewsError = action.payload;
        state.error = action.payload;
      })

      .addCase(cancelInterview.pending, (state) => {
        state.isSubmitting = true;
        state.interviewsError = null;
        state.error = null;
      })

      .addCase(cancelInterview.fulfilled, (state, action) => {
        state.isSubmitting = false;

        const cancelledInterview = action.payload;

        if (cancelledInterview?._id) {
          const index = state.interviews.findIndex(
            (interview) => interview._id === cancelledInterview._id,
          );

          if (index !== -1) {
            state.interviews[index] = cancelledInterview;
          }

          if (state.selectedInterview?._id === cancelledInterview._id) {
            state.selectedInterview = cancelledInterview;
          }
        }

        state.successMessage = "Interview cancelled successfully";
      })

      .addCase(cancelInterview.rejected, (state, action) => {
        state.isSubmitting = false;
        state.interviewsError = action.payload;
        state.error = action.payload;
      });
  },
});

// =====================================================
// ACTIONS
// =====================================================

export const {
  clearRecruiterError,
  clearRecruiterSuccess,
  clearSelectedJob,
  clearSelectedInterview,
  clearApplications,
  resetRecruiterState,
} = recruiterSlice.actions;

// =====================================================
// EXPORT
// =====================================================

export default recruiterSlice.reducer;
