import Api from "../../../api/Api";

const getMyResumes = async () => {
  const response = await Api.get("/resume");
  return response.data;
};

const getResumeById = async (resumeId) => {
  const response = await Api.get(`/resume/${resumeId}`);
  return response.data;
};

const uploadResume = async ({ title, file }) => {
  const formData = new FormData();

  formData.append("title", title);
  formData.append("resume", file);

  const response = await Api.post("/resume", formData, {
    headers: {
      "Content-Type": undefined,
    },
  });

  return response.data;
};

const makePrimaryResume = async (resumeId) => {
  const response = await Api.patch(`/resume/${resumeId}/primary`);
  return response.data;
};

const deleteResume = async (resumeId) => {
  const response = await Api.delete(`/resume/${resumeId}`);
  return response.data;
};

export default {
  getMyResumes,
  getResumeById,
  uploadResume,
  makePrimaryResume,
  deleteResume,
};
