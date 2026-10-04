import Api from "../../../api/Api";

const applyToJob = async (jobId, applicationData = {}) => {
  const response = await Api.post(
    `/applications/jobs/${jobId}/apply`,
    applicationData,
  );

  return response.data;
};

const getMyApplications = async () => {
  const response = await Api.get("/applications/my");
  return response.data;
};

const getApplicationById = async (applicationId) => {
  const response = await Api.get(`/applications/${applicationId}`);
  return response.data;
};

const withdrawApplication = async (applicationId) => {
  const response = await Api.patch(`/applications/${applicationId}/withdraw`);

  return response.data;
};

export default {
  applyToJob,
  getMyApplications,
  getApplicationById,
  withdrawApplication,
};
