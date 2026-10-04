import Api from "../../../api/Api";

const getSavedJobs = async () => {
  const response = await Api.get("/saved-jobs");

  return response.data;
};

const removeSavedJob = async (jobId) => {
  const response = await Api.delete(`/saved-jobs/${jobId}`);

  return response.data;
};

const checkSavedJob = async (jobId) => {
  const response = await Api.get(`/saved-jobs/${jobId}/check`);

  return response.data;
};

const savedJobApi = {
  getSavedJobs,
  removeSavedJob,
  checkSavedJob,
};

export default savedJobApi;
