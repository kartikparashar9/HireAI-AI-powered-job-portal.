import Api from "../../../api/Api";

const notificationApi = {
  getNotifications: async (params = {}) => {
    return Api.get("/notifications", {
      params,
    });
  },

  getUnreadNotificationCount: async () => {
    return Api.get("/notifications/unread-count");
  },

  markNotificationAsRead: async (notificationId) => {
    return Api.patch(`/notifications/${notificationId}/read`);
  },

  markAllNotificationsAsRead: async () => {
    return Api.patch("/notifications/read-all");
  },

  deleteNotification: async (notificationId) => {
    return Api.delete(`/notifications/${notificationId}`);
  },
};

export default notificationApi;
