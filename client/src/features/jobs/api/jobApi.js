import Api from "../../../api/Api";

/* =========================================================
   GET JOBS
========================================================= */

const getJobs = async (params = {}) => {
  const response = await Api.get("/jobs", {
    params,
  });

  return response.data;
};

/* =========================================================
   GET SINGLE JOB
========================================================= */

const getJobById = async (jobId) => {
  const response = await Api.get(`/jobs/${jobId}`);

  return response.data;
};

/* =========================================================
   SAVE JOB
========================================================= */

const saveJob = async (jobId) => {
  const response = await Api.post(`/saved-jobs/${jobId}`);

  return response.data;
};

/* =========================================================
   REMOVE SAVED JOB
========================================================= */

const removeSavedJob = async (jobId) => {
  const response = await Api.delete(`/saved-jobs/${jobId}`);

  return response.data;
};

/* =========================================================
   CHECK SAVED JOB
========================================================= */

const checkSavedJob = async (jobId) => {
  const response = await Api.get(`/saved-jobs/${jobId}/check`);

  return response.data;
};

const jobApi = {
  getJobs,
  getJobById,
  saveJob,
  removeSavedJob,
  checkSavedJob,
};

export default jobApi;
