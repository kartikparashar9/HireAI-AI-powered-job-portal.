import Api from "../../../api/Api";

const companyApi = {
  getCompanies: async (params = {}) => {
    return Api.get("/admin/companies", {
      params,
    });
  },

  getCompanyById: async (companyId) => {
    return Api.get(`/admin/companies/${companyId}`);
  },

  deleteCompany: async (companyId) => {
    return Api.delete(`/admin/companies/${companyId}`);
  },
};

export default companyApi;
