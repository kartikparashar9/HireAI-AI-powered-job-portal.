import Api from "../../../api/Api";

const careerApi = {
  getMyResumes: () => {
    return Api.get("/resume");
  },

  searchJobs: ({
    keyword = "",
    page = 1,
    limit = 10,
  } = {}) => {
    return Api.get("/jobs", {
      params: {
        keyword: keyword.trim(),
        page,
        limit,
      },
    });
  },
};

export default careerApi;