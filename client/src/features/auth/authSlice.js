import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import authApi from "./api/authApi";

/* =========================================================
   INITIAL STATE
========================================================= */

const initialState = {
  user: null,

  accessToken: localStorage.getItem("accessToken"),

  isAuthenticated: Boolean(localStorage.getItem("accessToken")),

  isLoading: false,

  isInitialized: false,

  error: null,

  successMessage: null,
};

/* =========================================================
   RESPONSE HELPERS
========================================================= */

const extractUser = (payload) => {
  return payload?.data?.user || payload?.user || null;
};

const extractAccessToken = (payload) => {
  return payload?.data?.accessToken || payload?.accessToken || null;
};

/* =========================================================
   REGISTER
========================================================= */

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

/* =========================================================
   LOGIN
========================================================= */

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

/* =========================================================
   GOOGLE LOGIN
========================================================= */

export const googleLoginUser = createAsyncThunk(
  "auth/googleLogin",

  async (credential, { rejectWithValue }) => {
    try {
      return await authApi.googleLogin(credential);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Google login failed",
      );
    }
  },
);

/* =========================================================
   LOGOUT
========================================================= */

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

/* =========================================================
   GET CURRENT USER
========================================================= */

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

/* =========================================================
   INITIALIZE AUTHENTICATION
========================================================= */

export const initializeAuth = createAsyncThunk(
  "auth/initialize",

  async (_, { rejectWithValue }) => {
    const storedToken = localStorage.getItem("accessToken");

    /* ---------------------------------------------
       NO EXISTING SESSION
    --------------------------------------------- */

    if (!storedToken) {
      return {
        user: null,
        accessToken: null,
      };
    }

    /* ---------------------------------------------
       TRY EXISTING ACCESS TOKEN
    --------------------------------------------- */

    try {
      const response = await authApi.getCurrentUser();

      return {
        user: extractUser(response),
        accessToken: storedToken,
      };
    } catch (error) {
      /* -------------------------------------------
         Only refresh on unauthorized response
      ------------------------------------------- */

      if (error.response?.status !== 401) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Unable to restore authentication session",
        );
      }

      /* -------------------------------------------
         ACCESS TOKEN EXPIRED
         TRY REFRESH TOKEN
      ------------------------------------------- */

      try {
        const refreshResponse = await authApi.refreshToken();

        const newAccessToken = extractAccessToken(refreshResponse);

        if (!newAccessToken) {
          throw new Error("Refresh token did not return an access token");
        }

        localStorage.setItem("accessToken", newAccessToken);

        /* -----------------------------------------
           GET USER WITH NEW ACCESS TOKEN
        ----------------------------------------- */

        const userResponse = await authApi.getCurrentUser();

        return {
          user: extractUser(userResponse),
          accessToken: newAccessToken,
        };
      } catch (refreshError) {
        localStorage.removeItem("accessToken");

        return rejectWithValue(
          refreshError.response?.data?.message || "Session expired",
        );
      }
    }
  },
);

/* =========================================================
   REFRESH ACCESS TOKEN
========================================================= */

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

/* =========================================================
   AUTH SLICE
========================================================= */

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    /* ---------------------------------------------
       CLEAR AUTH ERROR
    --------------------------------------------- */

    clearAuthError: (state) => {
      state.error = null;
    },

    /* ---------------------------------------------
       CLEAR SUCCESS MESSAGE
    --------------------------------------------- */

    clearSuccessMessage: (state) => {
      state.successMessage = null;
    },

    /* ---------------------------------------------
       SET CREDENTIALS
    --------------------------------------------- */

    setCredentials: (state, action) => {
      const { user, accessToken } = action.payload;

      state.user = user;

      state.accessToken = accessToken;

      state.isAuthenticated = Boolean(accessToken);

      state.isInitialized = true;

      state.error = null;

      if (accessToken) {
        localStorage.setItem("accessToken", accessToken);
      }
    },

    /* ---------------------------------------------
       CLEAR CREDENTIALS
    --------------------------------------------- */

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

      /* =================================================
         INITIALIZE AUTH
      ================================================= */

      .addCase(initializeAuth.pending, (state) => {
        state.isLoading = true;

        state.isInitialized = false;

        state.error = null;
      })

      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.isLoading = false;

        state.isInitialized = true;

        state.error = null;

        state.user = action.payload.user;

        state.accessToken = action.payload.accessToken;

        state.isAuthenticated = Boolean(action.payload.accessToken);

        if (action.payload.accessToken) {
          localStorage.setItem("accessToken", action.payload.accessToken);
        } else {
          localStorage.removeItem("accessToken");
        }
      })

      .addCase(initializeAuth.rejected, (state, action) => {
        state.isLoading = false;

        state.isInitialized = true;

        state.user = null;

        state.accessToken = null;

        state.isAuthenticated = false;

        state.error = action.payload || "Session initialization failed";

        localStorage.removeItem("accessToken");
      })

      /* =================================================
         REGISTER
      ================================================= */

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

      /* =================================================
         LOGIN
      ================================================= */

      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;

        state.error = null;

        state.successMessage = null;
      })

      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;

        state.error = null;

        const user = extractUser(action.payload);

        const accessToken = extractAccessToken(action.payload);

        state.user = user;

        state.accessToken = accessToken;

        state.isAuthenticated = Boolean(accessToken);

        state.isInitialized = true;

        if (accessToken) {
          localStorage.setItem("accessToken", accessToken);
        }
      })

      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;

        state.error = action.payload;

        state.user = null;

        state.accessToken = null;

        state.isAuthenticated = false;

        state.isInitialized = true;

        localStorage.removeItem("accessToken");
      })

      /* =================================================
         GOOGLE LOGIN
      ================================================= */

      .addCase(googleLoginUser.pending, (state) => {
        state.isLoading = true;

        state.error = null;

        state.successMessage = null;
      })

      .addCase(googleLoginUser.fulfilled, (state, action) => {
        state.isLoading = false;

        state.error = null;

        const user = extractUser(action.payload);

        const accessToken = extractAccessToken(action.payload);

        state.user = user;

        state.accessToken = accessToken;

        state.isAuthenticated = Boolean(accessToken);

        state.isInitialized = true;

        if (accessToken) {
          localStorage.setItem("accessToken", accessToken);
        }
      })

      .addCase(googleLoginUser.rejected, (state, action) => {
        state.isLoading = false;

        state.error = action.payload;

        state.user = null;

        state.accessToken = null;

        state.isAuthenticated = false;

        state.isInitialized = true;

        localStorage.removeItem("accessToken");
      })

      /* =================================================
         CURRENT USER
      ================================================= */

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

        state.accessToken = null;

        state.isAuthenticated = false;

        localStorage.removeItem("accessToken");
      })

      /* =================================================
         REFRESH ACCESS TOKEN
      ================================================= */

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

      /* =================================================
         LOGOUT
      ================================================= */

      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;

        state.error = null;
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
        /*
         * Even if backend logout fails,
         * clear the client session.
         */

        state.isLoading = false;

        state.user = null;

        state.accessToken = null;

        state.isAuthenticated = false;

        state.isInitialized = true;

        localStorage.removeItem("accessToken");
      });
  },
});

/* =========================================================
   ACTIONS
========================================================= */

export const {
  clearAuthError,
  clearSuccessMessage,
  setCredentials,
  clearCredentials,
} = authSlice.actions;

/* =========================================================
   REDUCER
========================================================= */

export default authSlice.reducer;
