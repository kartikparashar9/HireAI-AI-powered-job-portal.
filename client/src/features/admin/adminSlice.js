import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import adminUserApi from "./api/adminUserApi";
import recruiterApi from "./api/recruiterApi";
import companyApi from "./api/companyApi";

const getResponseData = (response) => {
  return response?.data?.data ?? response?.data;
};

const getErrorMessage = (error) => {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    "Something went wrong"
  );
};

/* =========================================================
   USERS
========================================================= */

export const fetchUsers = createAsyncThunk(
  "admin/fetchUsers",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await adminUserApi.getUsers(params);

      return getResponseData(response);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const fetchUserById = createAsyncThunk(
  "admin/fetchUserById",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await adminUserApi.getUserById(userId);

      return getResponseData(response);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const updateUserStatus = createAsyncThunk(
  "admin/updateUserStatus",
  async ({ userId, isActive }, { rejectWithValue }) => {
    try {
      const response = await adminUserApi.updateUserStatus(userId, isActive);

      return {
        userId,
        isActive,
        data: getResponseData(response),
      };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const deleteUser = createAsyncThunk(
  "admin/deleteUser",
  async (userId, { rejectWithValue }) => {
    try {
      await adminUserApi.deleteUser(userId);

      return userId;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

/* =========================================================
   RECRUITERS
========================================================= */

export const fetchRecruiters = createAsyncThunk(
  "admin/fetchRecruiters",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await recruiterApi.getRecruiters(params);

      return getResponseData(response);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const fetchPendingRecruiters = createAsyncThunk(
  "admin/fetchPendingRecruiters",
  async (_, { rejectWithValue }) => {
    try {
      const response = await recruiterApi.getPendingRecruiters();

      return getResponseData(response);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const approveRecruiter = createAsyncThunk(
  "admin/approveRecruiter",
  async (recruiterId, { rejectWithValue }) => {
    try {
      const response = await recruiterApi.approveRecruiter(recruiterId);

      return {
        recruiterId,
        data: getResponseData(response),
      };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const rejectRecruiter = createAsyncThunk(
  "admin/rejectRecruiter",
  async (recruiterId, { rejectWithValue }) => {
    try {
      const response = await recruiterApi.rejectRecruiter(recruiterId);

      return {
        recruiterId,
        data: getResponseData(response),
      };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

/* =========================================================
   COMPANIES
========================================================= */

export const fetchCompanies = createAsyncThunk(
  "admin/fetchCompanies",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await companyApi.getCompanies(params);

      return getResponseData(response);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const fetchCompanyById = createAsyncThunk(
  "admin/fetchCompanyById",
  async (companyId, { rejectWithValue }) => {
    try {
      const response = await companyApi.getCompanyById(companyId);

      return getResponseData(response);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const deleteCompany = createAsyncThunk(
  "admin/deleteCompany",
  async (companyId, { rejectWithValue }) => {
    try {
      await companyApi.deleteCompany(companyId);

      return companyId;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

/* =========================================================
   INITIAL STATE
========================================================= */

const initialState = {
  users: [],
  usersPagination: null,
  usersLoading: false,
  selectedUser: null,

  recruiters: [],
  recruitersPagination: null,
  pendingRecruiters: [],
  recruitersLoading: false,

  companies: [],
  companiesPagination: null,
  companiesLoading: false,
  selectedCompany: null,

  actionLoadingId: null,

  error: null,
  success: null,
};

/* =========================================================
   SLICE
========================================================= */

const adminSlice = createSlice({
  name: "admin",

  initialState,

  reducers: {
    clearAdminError: (state) => {
      state.error = null;
    },

    clearAdminSuccess: (state) => {
      state.success = null;
    },

    clearSelectedUser: (state) => {
      state.selectedUser = null;
    },

    clearSelectedCompany: (state) => {
      state.selectedCompany = null;
    },
  },

  extraReducers: (builder) => {
    builder

      /* =========================
         USERS
      ========================= */

      .addCase(fetchUsers.pending, (state) => {
        state.usersLoading = true;
        state.error = null;
      })

      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.usersLoading = false;

        state.users = action.payload?.users || [];

        state.usersPagination = action.payload?.pagination || null;
      })

      .addCase(fetchUsers.rejected, (state, action) => {
        state.usersLoading = false;
        state.error = action.payload;
      })

      .addCase(fetchUserById.pending, (state) => {
        state.error = null;
      })

      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.selectedUser = action.payload;
      })

      .addCase(fetchUserById.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(updateUserStatus.pending, (state, action) => {
        state.actionLoadingId = action.meta.arg.userId;
        state.error = null;
      })

      .addCase(updateUserStatus.fulfilled, (state, action) => {
        state.actionLoadingId = null;

        const user = state.users.find(
          (item) => String(item._id) === String(action.payload.userId),
        );

        if (user) {
          user.isActive = action.payload.isActive;
        }

        if (
          state.selectedUser &&
          String(state.selectedUser._id) === String(action.payload.userId)
        ) {
          state.selectedUser.isActive = action.payload.isActive;
        }

        state.success = "User status updated successfully";
      })

      .addCase(updateUserStatus.rejected, (state, action) => {
        state.actionLoadingId = null;
        state.error = action.payload;
      })

      .addCase(deleteUser.pending, (state, action) => {
        state.actionLoadingId = action.meta.arg;
        state.error = null;
      })

      .addCase(deleteUser.fulfilled, (state, action) => {
        state.actionLoadingId = null;

        state.users = state.users.filter(
          (user) => String(user._id) !== String(action.payload),
        );

        state.success = "User deleted successfully";
      })

      .addCase(deleteUser.rejected, (state, action) => {
        state.actionLoadingId = null;
        state.error = action.payload;
      })

      /* =========================
         RECRUITERS
      ========================= */

      .addCase(fetchRecruiters.pending, (state) => {
        state.recruitersLoading = true;
        state.error = null;
      })

      .addCase(fetchRecruiters.fulfilled, (state, action) => {
        state.recruitersLoading = false;

        state.recruiters = action.payload?.recruiters || [];

        state.recruitersPagination = action.payload?.pagination || null;
      })

      .addCase(fetchRecruiters.rejected, (state, action) => {
        state.recruitersLoading = false;
        state.error = action.payload;
      })

      .addCase(fetchPendingRecruiters.pending, (state) => {
        state.recruitersLoading = true;
        state.error = null;
      })

      .addCase(fetchPendingRecruiters.fulfilled, (state, action) => {
        state.recruitersLoading = false;

        state.pendingRecruiters = Array.isArray(action.payload)
          ? action.payload
          : action.payload?.recruiters || [];
      })

      .addCase(fetchPendingRecruiters.rejected, (state, action) => {
        state.recruitersLoading = false;
        state.error = action.payload;
      })

      .addCase(approveRecruiter.pending, (state, action) => {
        state.actionLoadingId = action.meta.arg;
        state.error = null;
      })

      .addCase(approveRecruiter.fulfilled, (state, action) => {
        state.actionLoadingId = null;

        state.pendingRecruiters = state.pendingRecruiters.filter(
          (recruiter) =>
            String(recruiter._id) !== String(action.payload.recruiterId),
        );

        const recruiter = state.recruiters.find(
          (item) => String(item._id) === String(action.payload.recruiterId),
        );

        if (recruiter) {
          recruiter.recruiterStatus = "APPROVED";
        }

        state.success = "Recruiter approved successfully";
      })

      .addCase(approveRecruiter.rejected, (state, action) => {
        state.actionLoadingId = null;
        state.error = action.payload;
      })

      .addCase(rejectRecruiter.pending, (state, action) => {
        state.actionLoadingId = action.meta.arg;
        state.error = null;
      })

      .addCase(rejectRecruiter.fulfilled, (state, action) => {
        state.actionLoadingId = null;

        state.pendingRecruiters = state.pendingRecruiters.filter(
          (recruiter) =>
            String(recruiter._id) !== String(action.payload.recruiterId),
        );

        const recruiter = state.recruiters.find(
          (item) => String(item._id) === String(action.payload.recruiterId),
        );

        if (recruiter) {
          recruiter.recruiterStatus = "REJECTED";
        }

        state.success = "Recruiter rejected successfully";
      })

      .addCase(rejectRecruiter.rejected, (state, action) => {
        state.actionLoadingId = null;
        state.error = action.payload;
      })

      /* =========================
         COMPANIES
      ========================= */

      .addCase(fetchCompanies.pending, (state) => {
        state.companiesLoading = true;
        state.error = null;
      })

      .addCase(fetchCompanies.fulfilled, (state, action) => {
        state.companiesLoading = false;

        state.companies = action.payload?.companies || [];

        state.companiesPagination = action.payload?.pagination || null;
      })

      .addCase(fetchCompanies.rejected, (state, action) => {
        state.companiesLoading = false;
        state.error = action.payload;
      })

      .addCase(fetchCompanyById.fulfilled, (state, action) => {
        state.selectedCompany = action.payload;
      })

      .addCase(fetchCompanyById.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(deleteCompany.pending, (state, action) => {
        state.actionLoadingId = action.meta.arg;
        state.error = null;
      })

      .addCase(deleteCompany.fulfilled, (state, action) => {
        state.actionLoadingId = null;

        state.companies = state.companies.filter(
          (company) => String(company._id) !== String(action.payload),
        );

        state.success = "Company deleted successfully";
      })

      .addCase(deleteCompany.rejected, (state, action) => {
        state.actionLoadingId = null;
        state.error = action.payload;
      });
  },
});

export const {
  clearAdminError,
  clearAdminSuccess,
  clearSelectedUser,
  clearSelectedCompany,
} = adminSlice.actions;

export default adminSlice.reducer;
