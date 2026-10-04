import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import notificationApi from "./api/notificationApi";

/* =========================================================
   Helpers
========================================================= */

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
   Initial State
========================================================= */

const initialState = {
  notifications: [],

  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  },

  unreadCount: 0,

  loading: false,
  unreadCountLoading: false,

  markReadLoadingId: null,
  markAllReadLoading: false,
  deleteLoadingId: null,

  error: null,
  success: null,
};

/* =========================================================
   Fetch Notifications
========================================================= */

export const fetchNotifications = createAsyncThunk(
  "notification/fetchNotifications",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await notificationApi.getNotifications({
        page: params.page ?? 1,
        limit: params.limit ?? 20,
        unreadOnly: params.unreadOnly ?? false,
      });

      return getResponseData(response);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

/* =========================================================
   Fetch Unread Count
========================================================= */

export const fetchUnreadNotificationCount = createAsyncThunk(
  "notification/fetchUnreadNotificationCount",
  async (_, { rejectWithValue }) => {
    try {
      const response = await notificationApi.getUnreadNotificationCount();

      return getResponseData(response);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

/* =========================================================
   Mark Notification As Read
========================================================= */

export const markNotificationAsRead = createAsyncThunk(
  "notification/markNotificationAsRead",
  async (notificationId, { rejectWithValue }) => {
    try {
      const response =
        await notificationApi.markNotificationAsRead(notificationId);

      return getResponseData(response);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

/* =========================================================
   Mark All Notifications As Read
========================================================= */

export const markAllNotificationsAsRead = createAsyncThunk(
  "notification/markAllNotificationsAsRead",
  async (_, { rejectWithValue }) => {
    try {
      await notificationApi.markAllNotificationsAsRead();

      return true;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

/* =========================================================
   Delete Notification
========================================================= */

export const deleteNotification = createAsyncThunk(
  "notification/deleteNotification",
  async (notificationId, { rejectWithValue }) => {
    try {
      await notificationApi.deleteNotification(notificationId);

      return notificationId;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

/* =========================================================
   Slice
========================================================= */

const notificationSlice = createSlice({
  name: "notification",
  initialState,

  reducers: {
    clearNotificationError: (state) => {
      state.error = null;
    },

    clearNotificationSuccess: (state) => {
      state.success = null;
    },

    clearNotifications: (state) => {
      state.notifications = [];
      state.pagination = {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0,
      };
    },
  },

  extraReducers: (builder) => {
    /* =====================================================
         FETCH NOTIFICATIONS
      ===================================================== */

    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;

        state.notifications = action.payload?.notifications ?? [];

        state.pagination = action.payload?.pagination ?? state.pagination;
      })

      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch notifications";
      });

    /* =====================================================
         UNREAD COUNT
      ===================================================== */

    builder
      .addCase(fetchUnreadNotificationCount.pending, (state) => {
        state.unreadCountLoading = true;
      })

      .addCase(fetchUnreadNotificationCount.fulfilled, (state, action) => {
        state.unreadCountLoading = false;

        state.unreadCount = action.payload?.count ?? 0;
      })

      .addCase(fetchUnreadNotificationCount.rejected, (state, action) => {
        state.unreadCountLoading = false;

        state.error =
          action.payload || "Failed to fetch unread notification count";
      });

    /* =====================================================
         MARK ONE AS READ
      ===================================================== */

    builder
      .addCase(markNotificationAsRead.pending, (state, action) => {
        state.markReadLoadingId = action.meta.arg;

        state.error = null;
      })

      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        state.markReadLoadingId = null;

        const notification = action.payload;

        const index = state.notifications.findIndex(
          (item) => item._id === notification?._id,
        );

        if (index !== -1) {
          state.notifications[index] = notification;
        }

        if (state.unreadCount > 0) {
          state.unreadCount -= 1;
        }
      })

      .addCase(markNotificationAsRead.rejected, (state, action) => {
        state.markReadLoadingId = null;

        state.error = action.payload || "Failed to mark notification as read";
      });

    /* =====================================================
         MARK ALL AS READ
      ===================================================== */

    builder
      .addCase(markAllNotificationsAsRead.pending, (state) => {
        state.markAllReadLoading = true;

        state.error = null;
      })

      .addCase(markAllNotificationsAsRead.fulfilled, (state) => {
        state.markAllReadLoading = false;

        state.notifications = state.notifications.map((notification) => ({
          ...notification,
          isRead: true,
          readAt: notification.readAt || new Date().toISOString(),
        }));

        state.unreadCount = 0;

        state.success = "All notifications marked as read";
      })

      .addCase(markAllNotificationsAsRead.rejected, (state, action) => {
        state.markAllReadLoading = false;

        state.error =
          action.payload || "Failed to mark all notifications as read";
      });

    /* =====================================================
         DELETE NOTIFICATION
      ===================================================== */

    builder
      .addCase(deleteNotification.pending, (state, action) => {
        state.deleteLoadingId = action.meta.arg;

        state.error = null;
      })

      .addCase(deleteNotification.fulfilled, (state, action) => {
        state.deleteLoadingId = null;

        const deletedId = action.payload;

        const notification = state.notifications.find(
          (item) => item._id === deletedId,
        );

        if (notification && !notification.isRead && state.unreadCount > 0) {
          state.unreadCount -= 1;
        }

        state.notifications = state.notifications.filter(
          (item) => item._id !== deletedId,
        );

        if (state.pagination.total > 0) {
          state.pagination.total -= 1;
        }
      })

      .addCase(deleteNotification.rejected, (state, action) => {
        state.deleteLoadingId = null;

        state.error = action.payload || "Failed to delete notification";
      });
  },
});

export const {
  clearNotificationError,
  clearNotificationSuccess,
  clearNotifications,
} = notificationSlice.actions;

export default notificationSlice.reducer;
