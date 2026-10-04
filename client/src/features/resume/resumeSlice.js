import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import resumeApi from "./api/resumeApi";

export const fetchResumes = createAsyncThunk(
  "resume/fetchResumes",
  async (_, { rejectWithValue }) => {
    try {
      return await resumeApi.getMyResumes();
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Unable to load resumes",
      );
    }
  },
);

export const uploadResume = createAsyncThunk(
  "resume/uploadResume",
  async ({ title, file }, { rejectWithValue }) => {
    try {
      return await resumeApi.uploadResume({ title, file });
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Unable to upload resume",
      );
    }
  },
);

export const makePrimaryResume = createAsyncThunk(
  "resume/makePrimary",
  async (resumeId, { rejectWithValue }) => {
    try {
      return await resumeApi.makePrimaryResume(resumeId);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Unable to update primary resume",
      );
    }
  },
);

export const deleteResume = createAsyncThunk(
  "resume/deleteResume",
  async (resumeId, { rejectWithValue }) => {
    try {
      await resumeApi.deleteResume(resumeId);

      return resumeId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Unable to delete resume",
      );
    }
  },
);

const initialState = {
  resumes: [],

  isLoading: false,
  isUploading: false,
  isPrimaryUpdating: {},
  isDeleting: {},

  error: null,
  uploadError: null,
  successMessage: null,
};

const resumeSlice = createSlice({
  name: "resume",

  initialState,

  reducers: {
    clearResumeError: (state) => {
      state.error = null;
    },

    clearUploadError: (state) => {
      state.uploadError = null;
    },

    clearResumeSuccess: (state) => {
      state.successMessage = null;
    },

    clearResumeState: (state) => {
      state.resumes = [];
      state.isLoading = false;
      state.isUploading = false;
      state.isPrimaryUpdating = {};
      state.isDeleting = {};
      state.error = null;
      state.uploadError = null;
      state.successMessage = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // FETCH
      .addCase(fetchResumes.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })

      .addCase(fetchResumes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;

        state.resumes = action.payload?.data || [];
      })

      .addCase(fetchResumes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Unable to load resumes";
      })

      // UPLOAD
      .addCase(uploadResume.pending, (state) => {
        state.isUploading = true;
        state.uploadError = null;
        state.successMessage = null;
      })

      .addCase(uploadResume.fulfilled, (state, action) => {
        state.isUploading = false;
        state.uploadError = null;

        const newResume = action.payload?.data;

        if (newResume) {
          state.resumes = [
            newResume,
            ...state.resumes.map((resume) => {
              if (newResume.isPrimary && resume._id !== newResume._id) {
                return {
                  ...resume,
                  isPrimary: false,
                };
              }

              return resume;
            }),
          ];
        }

        state.successMessage =
          action.payload?.message || "Resume uploaded successfully";
      })

      .addCase(uploadResume.rejected, (state, action) => {
        state.isUploading = false;
        state.uploadError = action.payload || "Unable to upload resume";
      })

      // MAKE PRIMARY
      .addCase(makePrimaryResume.pending, (state, action) => {
        state.isPrimaryUpdating[action.meta.arg] = true;
        state.error = null;
      })

      .addCase(makePrimaryResume.fulfilled, (state, action) => {
        const updatedResume = action.payload?.data;

        if (!updatedResume) {
          return;
        }

        state.isPrimaryUpdating[updatedResume._id] = false;

        state.resumes = state.resumes.map((resume) => ({
          ...resume,
          isPrimary: resume._id === updatedResume._id,
        }));

        state.successMessage =
          action.payload?.message || "Primary resume updated successfully";
      })

      .addCase(makePrimaryResume.rejected, (state, action) => {
        const resumeId = action.meta.arg;

        state.isPrimaryUpdating[resumeId] = false;

        state.error = action.payload || "Unable to update primary resume";
      })

      // DELETE
      .addCase(deleteResume.pending, (state, action) => {
        state.isDeleting[action.meta.arg] = true;
        state.error = null;
      })

      .addCase(deleteResume.fulfilled, (state, action) => {
        const resumeId = action.payload;

        state.isDeleting[resumeId] = false;

        state.resumes = state.resumes.filter(
          (resume) => resume._id !== resumeId,
        );

        state.successMessage = "Resume deleted successfully";
      })

      .addCase(deleteResume.rejected, (state, action) => {
        const resumeId = action.meta.arg;

        state.isDeleting[resumeId] = false;

        state.error = action.payload || "Unable to delete resume";
      });
  },
});

export const {
  clearResumeError,
  clearUploadError,
  clearResumeSuccess,
  clearResumeState,
} = resumeSlice.actions;

export const selectResumes = (state) => state.resume.resumes;

export const selectResumeLoading = (state) => state.resume.isLoading;

export const selectResumeUploading = (state) => state.resume.isUploading;

export const selectResumeError = (state) => state.resume.error;

export const selectResumeUploadError = (state) => state.resume.uploadError;

export const selectResumeSuccess = (state) => state.resume.successMessage;

export const selectResumePrimaryUpdating = (state) =>
  state.resume.isPrimaryUpdating;

export const selectResumeDeleting = (state) => state.resume.isDeleting;

export default resumeSlice.reducer;
