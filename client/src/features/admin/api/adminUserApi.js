import Api from "../../../api/Api";

const adminUserApi = {
  getUsers: async (params = {}) => {
    return Api.get("/admin/users", {
      params,
    });
  },

  getUserById: async (userId) => {
    return Api.get(`/admin/users/${userId}`);
  },

  updateUserStatus: async (userId, isActive) => {
    return Api.patch(`/admin/users/${userId}/status`, {
      isActive,
    });
  },

  deleteUser: async (userId) => {
    return Api.delete(`/admin/users/${userId}`);
  },
};

export default adminUserApi;
