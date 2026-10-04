import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import applicationApi from "./api/applicationApi";

// ==========================================
// FETCH MY APPLICATIONS
// ==========================================

export const fetchMyApplications = createAsyncThunk(
  "applications/fetchMyApplications",
  async (_, { rejectWithValue }) => {
    try {
      return await applicationApi.getMyApplications();
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Unable to load applications",
      );
    }
  },
);

// ==========================================
// APPLY TO JOB
// ==========================================

export const applyToJob = createAsyncThunk(
  "applications/applyToJob",
  async ({ jobId, applicationData }, { rejectWithValue }) => {
    try {
      return await applicationApi.applyToJob(jobId, applicationData);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Unable to submit application",
      );
    }
  },
);

// ==========================================
// GET APPLICATION BY ID
// ==========================================

export const fetchApplicationById = createAsyncThunk(
  "applications/fetchApplicationById",
  async (applicationId, { rejectWithValue }) => {
    try {
      return await applicationApi.getApplicationById(applicationId);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Unable to load application",
      );
    }
  },
);

// ==========================================
// WITHDRAW APPLICATION
// ==========================================

export const withdrawApplication = createAsyncThunk(
  "applications/withdrawApplication",
  async (applicationId, { rejectWithValue }) => {
    try {
      return await applicationApi.withdrawApplication(applicationId);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Unable to withdraw application",
      );
    }
  },
);

// ==========================================
// INITIAL STATE
// ==========================================

const initialState = {
  applications: [],
  selectedApplication: null,

  isLoading: false,
  isApplying: false,
  isDetailsLoading: false,

  isWithdrawing: {},

  error: null,
  applyError: null,
  detailsError: null,
  successMessage: null,
};

// ==========================================
// SLICE
// ==========================================

const applicationSlice = createSlice({
  name: "applications",
  initialState,

  reducers: {
    clearApplicationError: (state) => {
      state.error = null;
    },

    clearApplyError: (state) => {
      state.applyError = null;
    },

    clearApplicationDetailsError: (state) => {
      state.detailsError = null;
    },

    clearApplicationSuccess: (state) => {
      state.successMessage = null;
    },

    clearSelectedApplication: (state) => {
      state.selectedApplication = null;
      state.detailsError = null;
    },

    clearApplicationState: (state) => {
      state.applications = [];
      state.selectedApplication = null;

      state.isLoading = false;
      state.isApplying = false;
      state.isDetailsLoading = false;

      state.isWithdrawing = {};

      state.error = null;
      state.applyError = null;
      state.detailsError = null;
      state.successMessage = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // ==========================================
      // FETCH MY APPLICATIONS
      // ==========================================

      .addCase(fetchMyApplications.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })

      .addCase(fetchMyApplications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;

        state.applications = action.payload?.data || [];
      })

      .addCase(fetchMyApplications.rejected, (state, action) => {
        state.isLoading = false;

        state.error = action.payload || "Unable to load applications";
      })

      // ==========================================
      // APPLY TO JOB
      // ==========================================

      .addCase(applyToJob.pending, (state) => {
        state.isApplying = true;
        state.applyError = null;
        state.successMessage = null;
      })

      .addCase(applyToJob.fulfilled, (state, action) => {
        state.isApplying = false;
        state.applyError = null;

        const application = action.payload?.data;

        if (application) {
          state.applications.unshift(application);
        }

        state.successMessage =
          action.payload?.message || "Application submitted successfully";
      })

      .addCase(applyToJob.rejected, (state, action) => {
        state.isApplying = false;

        state.applyError = action.payload || "Unable to submit application";
      })

      // ==========================================
      // FETCH APPLICATION DETAILS
      // ==========================================

      .addCase(fetchApplicationById.pending, (state) => {
        state.isDetailsLoading = true;
        state.detailsError = null;
      })

      .addCase(fetchApplicationById.fulfilled, (state, action) => {
        state.isDetailsLoading = false;
        state.detailsError = null;

        state.selectedApplication = action.payload?.data || null;
      })

      .addCase(fetchApplicationById.rejected, (state, action) => {
        state.isDetailsLoading = false;

        state.detailsError = action.payload || "Unable to load application";
      })

      // ==========================================
      // WITHDRAW APPLICATION
      // ==========================================

      .addCase(withdrawApplication.pending, (state, action) => {
        const applicationId = action.meta.arg;

        state.isWithdrawing[applicationId] = true;
        state.error = null;
        state.successMessage = null;
      })

      .addCase(withdrawApplication.fulfilled, (state, action) => {
        const application = action.payload?.data;

        const applicationId = application?._id;

        if (applicationId) {
          state.isWithdrawing[applicationId] = false;

          const index = state.applications.findIndex(
            (item) => item?._id === applicationId,
          );

          if (index !== -1) {
            state.applications[index] = application;
          }

          if (state.selectedApplication?._id === applicationId) {
            state.selectedApplication = application;
          }
        }

        state.successMessage =
          action.payload?.message || "Application withdrawn successfully";
      })

      .addCase(withdrawApplication.rejected, (state, action) => {
        const applicationId = action.meta.arg;

        state.isWithdrawing[applicationId] = false;

        state.error = action.payload || "Unable to withdraw application";
      });
  },
});

// ==========================================
// ACTIONS
// ==========================================

export const {
  clearApplicationError,
  clearApplyError,
  clearApplicationDetailsError,
  clearApplicationSuccess,
  clearSelectedApplication,
  clearApplicationState,
} = applicationSlice.actions;

// ==========================================
// SELECTORS
// ==========================================

export const selectApplications = (state) => state.applications.applications;

export const selectSelectedApplication = (state) =>
  state.applications.selectedApplication;

export const selectApplicationsLoading = (state) =>
  state.applications.isLoading;

export const selectApplicationApplying = (state) =>
  state.applications.isApplying;

export const selectApplicationDetailsLoading = (state) =>
  state.applications.isDetailsLoading;

export const selectApplicationWithdrawing = (state) =>
  state.applications.isWithdrawing;

export const selectApplicationError = (state) => state.applications.error;

export const selectApplicationApplyError = (state) =>
  state.applications.applyError;

export const selectApplicationDetailsError = (state) =>
  state.applications.detailsError;

export const selectApplicationSuccess = (state) =>
  state.applications.successMessage;

export default applicationSlice.reducer;
