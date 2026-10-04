import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import profileApi from "./api/profileApi";

export const fetchProfile = createAsyncThunk(
  "profile/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      return await profileApi.getMyProfile();
    } catch (error) {
      return rejectWithValue({
        status: error.response?.status,
        message: error.response?.data?.message || "Unable to load profile",
      });
    }
  },
);

export const createProfile = createAsyncThunk(
  "profile/createProfile",
  async (profileData, { rejectWithValue }) => {
    try {
      return await profileApi.createProfile(profileData);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Unable to create profile",
      );
    }
  },
);

export const updateProfile = createAsyncThunk(
  "profile/updateProfile",
  async (profileData, { rejectWithValue }) => {
    try {
      return await profileApi.updateProfile(profileData);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Unable to update profile",
      );
    }
  },
);

export const deleteProfile = createAsyncThunk(
  "profile/deleteProfile",
  async (_, { rejectWithValue }) => {
    try {
      return await profileApi.deleteProfile();
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Unable to delete profile",
      );
    }
  },
);

const initialState = {
  profile: null,
  hasProfile: false,

  isLoading: false,
  isSaving: false,
  isDeleting: false,

  error: null,
  successMessage: null,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,

  reducers: {
    clearProfileError: (state) => {
      state.error = null;
    },

    clearProfileSuccess: (state) => {
      state.successMessage = null;
    },

    clearProfileState: (state) => {
      state.profile = null;
      state.hasProfile = false;
      state.isLoading = false;
      state.isSaving = false;
      state.isDeleting = false;
      state.error = null;
      state.successMessage = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // FETCH PROFILE
      .addCase(fetchProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })

      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;

        state.profile = action.payload?.data || null;
        state.hasProfile = Boolean(action.payload?.data);
      })

      .addCase(fetchProfile.rejected, (state, action) => {
        state.isLoading = false;

        // 404 means user simply hasn't created a profile yet.
        if (action.payload?.status === 404) {
          state.profile = null;
          state.hasProfile = false;
          state.error = null;
          return;
        }

        state.error = action.payload?.message || "Unable to load profile";
      })

      // CREATE PROFILE
      .addCase(createProfile.pending, (state) => {
        state.isSaving = true;
        state.error = null;
        state.successMessage = null;
      })

      .addCase(createProfile.fulfilled, (state, action) => {
        state.isSaving = false;
        state.error = null;

        state.profile = action.payload?.data || null;
        state.hasProfile = Boolean(action.payload?.data);

        state.successMessage =
          action.payload?.message || "Profile created successfully";
      })

      .addCase(createProfile.rejected, (state, action) => {
        state.isSaving = false;
        state.error = action.payload || "Unable to create profile";
      })

      // UPDATE PROFILE
      .addCase(updateProfile.pending, (state) => {
        state.isSaving = true;
        state.error = null;
        state.successMessage = null;
      })

      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isSaving = false;
        state.error = null;

        state.profile = action.payload?.data || null;
        state.hasProfile = Boolean(action.payload?.data);

        state.successMessage =
          action.payload?.message || "Profile updated successfully";
      })

      .addCase(updateProfile.rejected, (state, action) => {
        state.isSaving = false;
        state.error = action.payload || "Unable to update profile";
      })

      // DELETE PROFILE
      .addCase(deleteProfile.pending, (state) => {
        state.isDeleting = true;
        state.error = null;
        state.successMessage = null;
      })

      .addCase(deleteProfile.fulfilled, (state, action) => {
        state.isDeleting = false;
        state.error = null;

        state.profile = null;
        state.hasProfile = false;

        state.successMessage =
          action.payload?.message || "Profile deleted successfully";
      })

      .addCase(deleteProfile.rejected, (state, action) => {
        state.isDeleting = false;
        state.error = action.payload || "Unable to delete profile";
      });
  },
});

export const { clearProfileError, clearProfileSuccess, clearProfileState } =
  profileSlice.actions;

export const selectProfile = (state) => state.profile.profile;

export const selectHasProfile = (state) => state.profile.hasProfile;

export const selectProfileLoading = (state) => state.profile.isLoading;

export const selectProfileSaving = (state) => state.profile.isSaving;

export const selectProfileDeleting = (state) => state.profile.isDeleting;

export const selectProfileError = (state) => state.profile.error;

export const selectProfileSuccess = (state) => state.profile.successMessage;

export default profileSlice.reducer;