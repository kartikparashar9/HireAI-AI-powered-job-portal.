import Api from "../../../api/Api";

const getMyInterviews = async () => {
  const response = await Api.get("/interviews/my");
  return response.data;
};

const getInterviewById = async (interviewId) => {
  const response = await Api.get(`/interviews/${interviewId}`);
  return response.data;
};

const respondToInterview = async (interviewId, status) => {
  const response = await Api.patch(`/interviews/${interviewId}/respond`, {
    status,
  });
  return response.data;
};

const cancelInterview = async (interviewId) => {
  const response = await Api.patch(`/interviews/${interviewId}/cancel`);
  return response.data;
};

export default {
  getMyInterviews,
  getInterviewById,
  respondToInterview,
  cancelInterview,
};