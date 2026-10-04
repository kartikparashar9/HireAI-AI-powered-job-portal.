import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import savedJobApi from "./api/savedJobApi";

const extractData = (payload) => {
  return payload?.data ?? payload ?? null;
};

const normalizeSavedJobs = (payload) => {
  const data = extractData(payload);

  if (Array.isArray(data)) {
    return data;
  }

  return data?.savedJobs || data?.jobs || data?.items || [];
};

/* =========================================================
   GET SAVED JOBS
========================================================= */

export const fetchSavedJobs = createAsyncThunk(
  "savedJobs/fetchSavedJobs",

  async (_, { rejectWithValue }) => {
    try {
      return await savedJobApi.getSavedJobs();
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Unable to load saved jobs",
      );
    }
  },
);

/* =========================================================
   REMOVE SAVED JOB
========================================================= */

export const removeSavedJob = createAsyncThunk(
  "savedJobs/removeSavedJob",

  async (jobId, { rejectWithValue }) => {
    try {
      await savedJobApi.removeSavedJob(jobId);

      return jobId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Unable to remove saved job",
      );
    }
  },
);

/* =========================================================
   INITIAL STATE
========================================================= */

const initialState = {
  jobs: [],
  isLoading: false,
  isRemoving: {},
  error: null,
};

/* =========================================================
   SLICE
========================================================= */

const savedJobSlice = createSlice({
  name: "savedJobs",

  initialState,

  reducers: {
    clearSavedJobs: (state) => {
      state.jobs = [];
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      /* ===================================================
         FETCH SAVED JOBS
      =================================================== */

      .addCase(fetchSavedJobs.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })

      .addCase(fetchSavedJobs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;

        state.jobs = normalizeSavedJobs(action.payload);
      })

      .addCase(fetchSavedJobs.rejected, (state, action) => {
        state.isLoading = false;

        state.error = action.payload || "Unable to load saved jobs";
      })

      /* ===================================================
         REMOVE SAVED JOB - PENDING
      =================================================== */

      .addCase(removeSavedJob.pending, (state, action) => {
        const jobId = action.meta.arg;

        state.isRemoving[jobId] = true;
        state.error = null;
      })

      /* ===================================================
         REMOVE SAVED JOB - SUCCESS
      =================================================== */

      .addCase(removeSavedJob.fulfilled, (state, action) => {
        const jobId = action.payload;

        state.isRemoving[jobId] = false;

        /*
         * Saved job response can be:
         *
         * {
         *   _id: "savedJobId",
         *   job: {
         *     _id: "jobId"
         *   }
         * }
         *
         * OR:
         *
         * {
         *   _id: "jobId"
         * }
         *
         * We must compare against the ACTUAL JOB ID,
         * not the SavedJob document ID.
         */

        state.jobs = state.jobs.filter((item) => {
          const itemJob = item?.job || item;

          const itemJobId = itemJob?._id || item?.jobId;

          return itemJobId !== jobId;
        });
      })

      /* ===================================================
         REMOVE SAVED JOB - ERROR
      =================================================== */

      .addCase(removeSavedJob.rejected, (state, action) => {
        const jobId = action.meta.arg;

        state.isRemoving[jobId] = false;

        state.error = action.payload || "Unable to remove saved job";
      });
  },
});

/* =========================================================
   ACTIONS
========================================================= */

export const { clearSavedJobs } = savedJobSlice.actions;

/* =========================================================
   REDUCER
========================================================= */

export default savedJobSlice.reducer;