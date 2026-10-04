import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import aiApi from "./api/aiApi";

// =====================================================
// HELPERS
// =====================================================

const getErrorMessage = (error, fallback) => {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    fallback
  );
};

const normalizeResponse = (payload) => {
  return payload?.data ?? payload;
};

// =====================================================
// THUNKS
// =====================================================

export const fetchMyAnalyses = createAsyncThunk(
  "ai/fetchMyAnalyses",
  async (_, { rejectWithValue }) => {
    try {
      const response = await aiApi.getMyAnalyses();

      return normalizeResponse(response);
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to fetch AI analyses"),
      );
    }
  },
);

export const analyzeResume = createAsyncThunk(
  "ai/analyzeResume",
  async (resumeId, { rejectWithValue }) => {
    try {
      const response = await aiApi.getResumeAnalysis(resumeId);

      return normalizeResponse(response);
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to analyze resume"),
      );
    }
  },
);

export const matchJob = createAsyncThunk(
  "ai/matchJob",
  async ({ jobId, resumeId }, { rejectWithValue }) => {
    try {
      const response = await aiApi.getJobMatching(jobId, resumeId);

      return normalizeResponse(response);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Failed to match job"));
    }
  },
);

export const fetchJobRecommendations = createAsyncThunk(
  "ai/fetchJobRecommendations",
  async ({ resumeId, candidateProfile = {} }, { rejectWithValue }) => {
    try {
      const response = await aiApi.getJobRecommendations({
        resumeId,
        candidateProfile,
      });

      return normalizeResponse(response);
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to fetch job recommendations"),
      );
    }
  },
);

export const analyzeSkillGap = createAsyncThunk(
  "ai/analyzeSkillGap",
  async ({ jobId, resumeId }, { rejectWithValue }) => {
    try {
      const response = await aiApi.getSkillGap(jobId, resumeId);

      return normalizeResponse(response);
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to analyze skill gap"),
      );
    }
  },
);

export const prepareInterview = createAsyncThunk(
  "ai/prepareInterview",
  async ({ jobId, resumeId, candidateProfile = {} }, { rejectWithValue }) => {
    try {
      const response = await aiApi.getInterviewPreparation({
        jobId,
        resumeId,
        candidateProfile,
      });

      return normalizeResponse(response);
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to generate interview preparation"),
      );
    }
  },
);

// =====================================================
// INITIAL STATE
// =====================================================

const initialState = {
  analyses: [],

  resumeAnalysis: null,
  jobMatching: null,
  jobRecommendations: [],
  skillGap: null,
  interviewPreparation: null,

  isLoading: false,
  isResumeAnalyzing: false,
  isJobMatching: false,
  isRecommendationsLoading: false,
  isSkillGapAnalyzing: false,
  isInterviewPreparing: false,

  error: null,
  resumeAnalysisError: null,
  jobMatchingError: null,
  recommendationsError: null,
  skillGapError: null,
  interviewPreparationError: null,

  successMessage: null,
};

// =====================================================
// SLICE
// =====================================================

const aiSlice = createSlice({
  name: "ai",

  initialState,

  reducers: {
    clearAIError: (state) => {
      state.error = null;
    },

    clearResumeAnalysis: (state) => {
      state.resumeAnalysis = null;
      state.resumeAnalysisError = null;
    },

    clearJobMatching: (state) => {
      state.jobMatching = null;
      state.jobMatchingError = null;
    },

    clearJobRecommendations: (state) => {
      state.jobRecommendations = [];
      state.recommendationsError = null;
    },

    clearSkillGap: (state) => {
      state.skillGap = null;
      state.skillGapError = null;
    },

    clearInterviewPreparation: (state) => {
      state.interviewPreparation = null;
      state.interviewPreparationError = null;
    },

    clearAISuccess: (state) => {
      state.successMessage = null;
    },

    clearAllAIData: (state) => {
      state.analyses = [];

      state.resumeAnalysis = null;
      state.jobMatching = null;
      state.jobRecommendations = [];
      state.skillGap = null;
      state.interviewPreparation = null;

      state.error = null;
      state.resumeAnalysisError = null;
      state.jobMatchingError = null;
      state.recommendationsError = null;
      state.skillGapError = null;
      state.interviewPreparationError = null;

      state.successMessage = null;
    },
  },

  extraReducers: (builder) => {
    // =================================================
    // FETCH ALL ANALYSES
    // =================================================

    builder
      .addCase(fetchMyAnalyses.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })

      .addCase(fetchMyAnalyses.fulfilled, (state, action) => {
        state.isLoading = false;

        state.analyses = Array.isArray(action.payload) ? action.payload : [];
      })

      .addCase(fetchMyAnalyses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // =================================================
    // RESUME ANALYSIS
    // =================================================

    builder
      .addCase(analyzeResume.pending, (state) => {
        state.isResumeAnalyzing = true;
        state.resumeAnalysisError = null;
      })

      .addCase(analyzeResume.fulfilled, (state, action) => {
        state.isResumeAnalyzing = false;
        state.resumeAnalysis = action.payload;
        state.successMessage = "Resume analyzed successfully";
      })

      .addCase(analyzeResume.rejected, (state, action) => {
        state.isResumeAnalyzing = false;
        state.resumeAnalysisError = action.payload;
      });

    // =================================================
    // JOB MATCHING
    // =================================================

    builder
      .addCase(matchJob.pending, (state) => {
        state.isJobMatching = true;
        state.jobMatchingError = null;
      })

      .addCase(matchJob.fulfilled, (state, action) => {
        state.isJobMatching = false;
        state.jobMatching = action.payload;
        state.successMessage = "Job match generated successfully";
      })

      .addCase(matchJob.rejected, (state, action) => {
        state.isJobMatching = false;
        state.jobMatchingError = action.payload;
      });

    // =================================================
    // JOB RECOMMENDATIONS
    // =================================================

    builder
      .addCase(fetchJobRecommendations.pending, (state) => {
        state.isRecommendationsLoading = true;
        state.recommendationsError = null;
      })

      .addCase(fetchJobRecommendations.fulfilled, (state, action) => {
        state.isRecommendationsLoading = false;

        const payload = action.payload;

        if (Array.isArray(payload)) {
          state.jobRecommendations = payload;
        } else if (Array.isArray(payload?.recommendations)) {
          state.jobRecommendations = payload.recommendations;
        } else {
          state.jobRecommendations = [];
        }

        state.successMessage = "Job recommendations generated successfully";
      })

      .addCase(fetchJobRecommendations.rejected, (state, action) => {
        state.isRecommendationsLoading = false;
        state.recommendationsError = action.payload;
      });

    // =================================================
    // SKILL GAP
    // =================================================

    builder
      .addCase(analyzeSkillGap.pending, (state) => {
        state.isSkillGapAnalyzing = true;
        state.skillGapError = null;
      })

      .addCase(analyzeSkillGap.fulfilled, (state, action) => {
        state.isSkillGapAnalyzing = false;
        state.skillGap = action.payload;
        state.successMessage = "Skill gap analysis generated successfully";
      })

      .addCase(analyzeSkillGap.rejected, (state, action) => {
        state.isSkillGapAnalyzing = false;
        state.skillGapError = action.payload;
      });

    // =================================================
    // INTERVIEW PREPARATION
    // =================================================

    builder
      .addCase(prepareInterview.pending, (state) => {
        state.isInterviewPreparing = true;
        state.interviewPreparationError = null;
      })

      .addCase(prepareInterview.fulfilled, (state, action) => {
        state.isInterviewPreparing = false;
        state.interviewPreparation = action.payload;
        state.successMessage = "Interview preparation generated successfully";
      })

      .addCase(prepareInterview.rejected, (state, action) => {
        state.isInterviewPreparing = false;
        state.interviewPreparationError = action.payload;
      });
  },
});

// =====================================================
// ACTIONS
// =====================================================

export const {
  clearAIError,
  clearResumeAnalysis,
  clearJobMatching,
  clearJobRecommendations,
  clearSkillGap,
  clearInterviewPreparation,
  clearAISuccess,
  clearAllAIData,
} = aiSlice.actions;

// =====================================================
// SELECTORS
// =====================================================

export const selectAI = (state) => state.ai;

export const selectAIAnalyses = (state) => state.ai?.analyses || [];

export const selectResumeAnalysis = (state) => state.ai?.resumeAnalysis || null;

export const selectJobMatching = (state) => state.ai?.jobMatching || null;

export const selectJobRecommendations = (state) =>
  state.ai?.jobRecommendations || [];

export const selectSkillGap = (state) => state.ai?.skillGap || null;

export const selectInterviewPreparation = (state) =>
  state.ai?.interviewPreparation || null;

export const selectAILoading = (state) => Boolean(state.ai?.isLoading);

export const selectResumeAnalysisLoading = (state) =>
  Boolean(state.ai?.isResumeAnalyzing);

export const selectJobMatchingLoading = (state) =>
  Boolean(state.ai?.isJobMatching);

export const selectRecommendationsLoading = (state) =>
  Boolean(state.ai?.isRecommendationsLoading);

export const selectSkillGapLoading = (state) =>
  Boolean(state.ai?.isSkillGapAnalyzing);

export const selectInterviewPreparationLoading = (state) =>
  Boolean(state.ai?.isInterviewPreparing);

export const selectAIError = (state) => state.ai?.error || null;

export const selectResumeAnalysisError = (state) =>
  state.ai?.resumeAnalysisError || null;

export const selectJobMatchingError = (state) =>
  state.ai?.jobMatchingError || null;

export const selectRecommendationsError = (state) =>
  state.ai?.recommendationsError || null;

export const selectSkillGapError = (state) => state.ai?.skillGapError || null;

export const selectInterviewPreparationError = (state) =>
  state.ai?.interviewPreparationError || null;

// =====================================================
// EXPORT
// =====================================================

export default aiSlice.reducer;
