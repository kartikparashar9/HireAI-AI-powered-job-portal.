import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import authApi from "./api/authApi";

const initialState = {
  user: null,
  accessToken: localStorage.getItem("accessToken"),
  isAuthenticated: Boolean(localStorage.getItem("accessToken")),
  isLoading: false,
  isInitialized: false,
  error: null,
  successMessage: null,
};

export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      return await authApi.register(userData);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Registration failed",
      );
    }
  },
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      return await authApi.login(credentials);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  },
);

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      return await authApi.logout();
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Logout failed");
    }
  },
);

export const fetchCurrentUser = createAsyncThunk(
  "auth/me",
  async (_, { rejectWithValue }) => {
    try {
      return await authApi.getCurrentUser();
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Unable to fetch user",
      );
    }
  },
);

export const refreshAccessToken = createAsyncThunk(
  "auth/refresh",
  async (_, { rejectWithValue }) => {
    try {
      return await authApi.refreshToken();
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Session expired",
      );
    }
  },
);

const extractUser = (payload) => {
  return payload?.data?.user || payload?.user || null;
};

const extractAccessToken = (payload) => {
  return payload?.data?.accessToken || payload?.accessToken || null;
};

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },

    clearSuccessMessage: (state) => {
      state.successMessage = null;
    },

    setCredentials: (state, action) => {
      const { user, accessToken } = action.payload;

      state.user = user;
      state.accessToken = accessToken;
      state.isAuthenticated = Boolean(accessToken);
      state.error = null;

      if (accessToken) {
        localStorage.setItem("accessToken", accessToken);
      }
    },

    clearCredentials: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.isInitialized = true;
      state.error = null;

      localStorage.removeItem("accessToken");
    },
  },

  extraReducers: (builder) => {
    builder

      // REGISTER

      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.successMessage = null;
      })

      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;

        state.successMessage =
          action.payload?.message ||
          "Registration successful. Please verify your email.";
      })

      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // LOGIN

      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })

      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;

        const user = extractUser(action.payload);
        const accessToken = extractAccessToken(action.payload);

        state.user = user;
        state.accessToken = accessToken;
        state.isAuthenticated = Boolean(accessToken);

        if (accessToken) {
          localStorage.setItem("accessToken", accessToken);
        }
      })

      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })

      // ME

      .addCase(fetchCurrentUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })

      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isInitialized = true;
        state.error = null;

        state.user = extractUser(action.payload);
        state.isAuthenticated = Boolean(state.accessToken);
      })

      .addCase(fetchCurrentUser.rejected, (state) => {
        state.isLoading = false;
        state.isInitialized = true;
        state.user = null;
        state.isAuthenticated = false;

        localStorage.removeItem("accessToken");
        state.accessToken = null;
      })

      // REFRESH

      .addCase(refreshAccessToken.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })

      .addCase(refreshAccessToken.fulfilled, (state, action) => {
        state.isLoading = false;

        const accessToken = extractAccessToken(action.payload);

        if (accessToken) {
          state.accessToken = accessToken;
          state.isAuthenticated = true;

          localStorage.setItem("accessToken", accessToken);
        }
      })

      .addCase(refreshAccessToken.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.accessToken = null;
        state.isAuthenticated = false;
        state.isInitialized = true;

        localStorage.removeItem("accessToken");
      })

      // LOGOUT

      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })

      .addCase(logoutUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.accessToken = null;
        state.isAuthenticated = false;
        state.isInitialized = true;
        state.error = null;

        state.successMessage =
          action.payload?.message || "Logged out successfully";

        localStorage.removeItem("accessToken");
      })

      .addCase(logoutUser.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.accessToken = null;
        state.isAuthenticated = false;

        localStorage.removeItem("accessToken");
      });
  },
});

export const {
  clearAuthError,
  clearSuccessMessage,
  setCredentials,
  clearCredentials,
} = authSlice.actions;

export default authSlice.reducer;