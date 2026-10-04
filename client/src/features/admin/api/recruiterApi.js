import Api from "../../../api/Api";

const recruiterApi = {
  getRecruiters: async (params = {}) => {
    return Api.get("/admin/recruiters", {
      params,
    });
  },

  getPendingRecruiters: async () => {
    return Api.get("/admin/recruiters/pending");
  },

  approveRecruiter: async (recruiterId) => {
    return Api.patch(`/admin/recruiters/${recruiterId}/approve`);
  },

  rejectRecruiter: async (recruiterId) => {
    return Api.patch(`/admin/recruiters/${recruiterId}/reject`);
  },
};

export default recruiterApi;