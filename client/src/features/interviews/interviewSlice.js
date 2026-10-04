import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import interviewApi from "./api/interviewApi";

/* =========================
   Initial State
========================= */

const initialState = {
  interviews: [],
  selectedInterview: null,

  isLoading: false,
  isDetailsLoading: false,

  isResponding: {},
  isCancelling: {},

  error: null,
  detailsError: null,
  actionError: null,

  successMessage: null,
};

/* =========================
   Thunks
========================= */

export const fetchMyInterviews = createAsyncThunk(
  "interviews/fetchMyInterviews",
  async (_, { rejectWithValue }) => {
    try {
      return await interviewApi.getMyInterviews();
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch interviews.",
      );
    }
  },
);

export const fetchInterviewById = createAsyncThunk(
  "interviews/fetchInterviewById",
  async (interviewId, { rejectWithValue }) => {
    try {
      return await interviewApi.getInterviewById(interviewId);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch interview details.",
      );
    }
  },
);

export const respondToInterview = createAsyncThunk(
  "interviews/respondToInterview",
  async ({ interviewId, status }, { rejectWithValue }) => {
    try {
      return await interviewApi.respondToInterview(interviewId, status);
    } catch (error) {
      return rejectWithValue({
        interviewId,
        message:
          error.response?.data?.message ||
          "Failed to update interview response.",
      });
    }
  },
);

export const cancelInterview = createAsyncThunk(
  "interviews/cancelInterview",
  async (interviewId, { rejectWithValue }) => {
    try {
      return await interviewApi.cancelInterview(interviewId);
    } catch (error) {
      return rejectWithValue({
        interviewId,
        message: error.response?.data?.message || "Failed to cancel interview.",
      });
    }
  },
);

/* =========================
   Helpers
========================= */

const getInterviewFromResponse = (payload) => {
  return payload?.data || payload?.interview || payload;
};

/* =========================
   Slice
========================= */

const interviewSlice = createSlice({
  name: "interviews",

  initialState,

  reducers: {
    clearInterviewError: (state) => {
      state.error = null;
    },

    clearInterviewDetailsError: (state) => {
      state.detailsError = null;
    },

    clearInterviewActionError: (state) => {
      state.actionError = null;
    },

    clearInterviewSuccess: (state) => {
      state.successMessage = null;
    },

    clearSelectedInterview: (state) => {
      state.selectedInterview = null;
    },

    clearInterviewState: () => {
      return initialState;
    },
  },

  extraReducers: (builder) => {
    /* =========================
       Fetch My Interviews
    ========================= */

    builder
      .addCase(fetchMyInterviews.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })

      .addCase(fetchMyInterviews.fulfilled, (state, action) => {
        state.isLoading = false;

        const payload = action.payload;

        state.interviews =
          payload?.data ||
          payload?.interviews ||
          (Array.isArray(payload) ? payload : []);
      })

      .addCase(fetchMyInterviews.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to fetch interviews.";
      });

    /* =========================
       Fetch Interview Details
    ========================= */

    builder
      .addCase(fetchInterviewById.pending, (state) => {
        state.isDetailsLoading = true;
        state.detailsError = null;
        state.selectedInterview = null;
      })

      .addCase(fetchInterviewById.fulfilled, (state, action) => {
        state.isDetailsLoading = false;

        state.selectedInterview = getInterviewFromResponse(action.payload);
      })

      .addCase(fetchInterviewById.rejected, (state, action) => {
        state.isDetailsLoading = false;

        state.detailsError =
          action.payload || "Failed to fetch interview details.";
      });

    /* =========================
       Respond To Interview
    ========================= */

    builder
      .addCase(respondToInterview.pending, (state, action) => {
        const { interviewId } = action.meta.arg;

        state.isResponding[interviewId] = true;
        state.actionError = null;
        state.successMessage = null;
      })

      .addCase(respondToInterview.fulfilled, (state, action) => {
        const { interviewId } = action.meta.arg;

        state.isResponding[interviewId] = false;

        const updatedInterview = getInterviewFromResponse(action.payload);

        if (updatedInterview?._id) {
          state.interviews = state.interviews.map((interview) =>
            interview._id === updatedInterview._id
              ? updatedInterview
              : interview,
          );

          if (state.selectedInterview?._id === updatedInterview._id) {
            state.selectedInterview = updatedInterview;
          }
        }

        state.successMessage =
          action.payload?.message || "Interview response updated successfully.";
      })

      .addCase(respondToInterview.rejected, (state, action) => {
        const interviewId = action.payload?.interviewId;

        if (interviewId) {
          state.isResponding[interviewId] = false;
        }

        state.actionError =
          action.payload?.message || "Failed to update interview response.";
      });

    /* =========================
       Cancel Interview
    ========================= */

    builder
      .addCase(cancelInterview.pending, (state, action) => {
        const interviewId = action.meta.arg;

        state.isCancelling[interviewId] = true;
        state.actionError = null;
        state.successMessage = null;
      })

      .addCase(cancelInterview.fulfilled, (state, action) => {
        const interviewId = action.meta.arg;

        state.isCancelling[interviewId] = false;

        const updatedInterview = getInterviewFromResponse(action.payload);

        if (updatedInterview?._id) {
          state.interviews = state.interviews.map((interview) =>
            interview._id === updatedInterview._id
              ? updatedInterview
              : interview,
          );

          if (state.selectedInterview?._id === updatedInterview._id) {
            state.selectedInterview = updatedInterview;
          }
        } else {
          state.interviews = state.interviews.map((interview) =>
            interview._id === interviewId
              ? {
                  ...interview,
                  status: "CANCELLED",
                }
              : interview,
          );

          if (state.selectedInterview?._id === interviewId) {
            state.selectedInterview = {
              ...state.selectedInterview,
              status: "CANCELLED",
            };
          }
        }

        state.successMessage =
          action.payload?.message || "Interview cancelled successfully.";
      })

      .addCase(cancelInterview.rejected, (state, action) => {
        const interviewId = action.payload?.interviewId;

        if (interviewId) {
          state.isCancelling[interviewId] = false;
        }

        state.actionError =
          action.payload?.message || "Failed to cancel interview.";
      });
  },
});

/* =========================
   Actions
========================= */

export const {
  clearInterviewError,
  clearInterviewDetailsError,
  clearInterviewActionError,
  clearInterviewSuccess,
  clearSelectedInterview,
  clearInterviewState,
} = interviewSlice.actions;

/* =========================
   Selectors
========================= */

export const selectInterviews = (state) => state.interviews.interviews;

export const selectSelectedInterview = (state) =>
  state.interviews.selectedInterview;

export const selectInterviewsLoading = (state) => state.interviews.isLoading;

export const selectInterviewDetailsLoading = (state) =>
  state.interviews.isDetailsLoading;

export const selectInterviewResponding = (state) =>
  state.interviews.isResponding;

export const selectInterviewCancelling = (state) =>
  state.interviews.isCancelling;

export const selectInterviewError = (state) => state.interviews.error;

export const selectInterviewDetailsError = (state) =>
  state.interviews.detailsError;

export const selectInterviewActionError = (state) =>
  state.interviews.actionError;

export const selectInterviewSuccess = (state) =>
  state.interviews.successMessage;

export default interviewSlice.reducer;