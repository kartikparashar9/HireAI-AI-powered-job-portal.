import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import jobApi from "./api/jobApi";

/* =========================================================
   HELPERS
========================================================= */

const getPayloadData = (payload) => {
  return payload?.data ?? payload ?? null;
};

const getErrorMessage = (error, fallback) => {
  return (
    error.response?.data?.message || error.response?.data?.error || fallback
  );
};

const normalizeJobsResponse = (payload) => {
  const data = getPayloadData(payload);

  return {
    jobs: Array.isArray(data?.jobs)
      ? data.jobs
      : Array.isArray(data)
        ? data
        : [],

    pagination: {
      page: data?.pagination?.page ?? 1,
      limit: data?.pagination?.limit ?? 10,
      totalJobs: data?.pagination?.totalJobs ?? 0,
      totalPages: data?.pagination?.totalPages ?? 1,
      hasNextPage: data?.pagination?.hasNextPage ?? false,
      hasPreviousPage: data?.pagination?.hasPreviousPage ?? false,
    },
  };
};

const normalizeJob = (payload) => {
  const data = getPayloadData(payload);

  return data?.job ?? data;
};

/* =========================================================
   INITIAL STATE
========================================================= */

const initialState = {
  jobs: [],
  selectedJob: null,

  pagination: {
    page: 1,
    limit: 10,
    totalJobs: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  },

  filters: {
    keyword: "",
    location: "",
    jobType: "",
    workMode: "",
    skills: "",
    experienceMin: "",
    experienceMax: "",
    salaryMin: "",
    salaryMax: "",
    sort: "latest",
  },

  isLoading: false,
  isDetailsLoading: false,

  // Per-job loading state
  isSaveLoading: {},

  // Per-job saved state
  savedJobs: {},

  error: null,
  detailsError: null,
};

/* =========================================================
   FETCH JOBS
========================================================= */

export const fetchJobs = createAsyncThunk(
  "jobs/fetchJobs",
  async (params = {}, { rejectWithValue }) => {
    try {
      return await jobApi.getJobs(params);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Unable to load jobs"));
    }
  },
);

/* =========================================================
   FETCH SINGLE JOB
========================================================= */

export const fetchJobById = createAsyncThunk(
  "jobs/fetchJobById",
  async (jobId, { rejectWithValue }) => {
    try {
      return await jobApi.getJobById(jobId);
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Unable to load job details"),
      );
    }
  },
);

/* =========================================================
   SAVE JOB
========================================================= */

export const saveJob = createAsyncThunk(
  "jobs/saveJob",
  async (jobId, { rejectWithValue }) => {
    try {
      await jobApi.saveJob(jobId);

      return {
        jobId,
        saved: true,
      };
    } catch (error) {
      return rejectWithValue({
        jobId,
        message: getErrorMessage(error, "Unable to save job"),
      });
    }
  },
);

/* =========================================================
   REMOVE SAVED JOB
========================================================= */

export const removeSavedJob = createAsyncThunk(
  "jobs/removeSavedJob",
  async (jobId, { rejectWithValue }) => {
    try {
      await jobApi.removeSavedJob(jobId);

      return {
        jobId,
        saved: false,
      };
    } catch (error) {
      return rejectWithValue({
        jobId,
        message: getErrorMessage(error, "Unable to remove saved job"),
      });
    }
  },
);

/* =========================================================
   CHECK SAVED JOB
========================================================= */

export const checkSavedJob = createAsyncThunk(
  "jobs/checkSavedJob",
  async (jobId, { rejectWithValue }) => {
    try {
      const response = await jobApi.checkSavedJob(jobId);

      const data = getPayloadData(response);

      return {
        jobId,
        saved: Boolean(data?.isSaved ?? data?.saved ?? false),
      };
    } catch (error) {
      return rejectWithValue({
        jobId,
        message: getErrorMessage(error, "Unable to check saved job"),
      });
    }
  },
);

/* =========================================================
   SLICE
========================================================= */

const jobsSlice = createSlice({
  name: "jobs",

  initialState,

  reducers: {
    setJobFilters: (state, action) => {
      state.filters = {
        ...state.filters,
        ...action.payload,
      };
    },

    clearJobFilters: (state) => {
      state.filters = {
        ...initialState.filters,
      };
    },

    clearSelectedJob: (state) => {
      state.selectedJob = null;
      state.detailsError = null;
    },

    clearJobsError: (state) => {
      state.error = null;
    },

    clearDetailsError: (state) => {
      state.detailsError = null;
    },
  },

  extraReducers: (builder) => {
    builder

      /* ===================================================
         FETCH JOBS
      =================================================== */

      .addCase(fetchJobs.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })

      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;

        const result = normalizeJobsResponse(action.payload);

        state.jobs = result.jobs;
        state.pagination = result.pagination;
      })

      .addCase(fetchJobs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Unable to load jobs";
      })

      /* ===================================================
         FETCH SINGLE JOB
      =================================================== */

      .addCase(fetchJobById.pending, (state) => {
        state.isDetailsLoading = true;
        state.detailsError = null;
      })

      .addCase(fetchJobById.fulfilled, (state, action) => {
        state.isDetailsLoading = false;
        state.detailsError = null;

        state.selectedJob = normalizeJob(action.payload);
      })

      .addCase(fetchJobById.rejected, (state, action) => {
        state.isDetailsLoading = false;
        state.detailsError = action.payload || "Unable to load job details";
      })

      /* ===================================================
         SAVE JOB
      =================================================== */

      .addCase(saveJob.pending, (state, action) => {
        const jobId = action.meta.arg;

        state.isSaveLoading[jobId] = true;
      })

      .addCase(saveJob.fulfilled, (state, action) => {
        const { jobId, saved } = action.payload;

        state.isSaveLoading[jobId] = false;
        state.savedJobs[jobId] = saved;
      })

      .addCase(saveJob.rejected, (state, action) => {
        const jobId = action.payload?.jobId;

        if (jobId) {
          state.isSaveLoading[jobId] = false;
        }
      })

      /* ===================================================
         REMOVE SAVED JOB
      =================================================== */

      .addCase(removeSavedJob.pending, (state, action) => {
        const jobId = action.meta.arg;

        state.isSaveLoading[jobId] = true;
      })

      .addCase(removeSavedJob.fulfilled, (state, action) => {
        const { jobId, saved } = action.payload;

        state.isSaveLoading[jobId] = false;
        state.savedJobs[jobId] = saved;
      })

      .addCase(removeSavedJob.rejected, (state, action) => {
        const jobId = action.payload?.jobId;

        if (jobId) {
          state.isSaveLoading[jobId] = false;
        }
      })

      /* ===================================================
         CHECK SAVED JOB
      =================================================== */

      .addCase(checkSavedJob.fulfilled, (state, action) => {
        const { jobId, saved } = action.payload;

        state.savedJobs[jobId] = saved;
      })

      .addCase(checkSavedJob.rejected, (state, action) => {
        const jobId = action.payload?.jobId;

        if (jobId) {
          // Don't change saved state on check failure.
          // This prevents an API failure from incorrectly
          // marking an already-saved job as unsaved.
          state.savedJobs[jobId] = state.savedJobs[jobId] ?? false;
        }
      });
  },
});

/* =========================================================
   ACTIONS
========================================================= */

export const {
  setJobFilters,
  clearJobFilters,
  clearSelectedJob,
  clearJobsError,
  clearDetailsError,
} = jobsSlice.actions;

/* =========================================================
   REDUCER
========================================================= */

export default jobsSlice.reducer;
