import Api from "../../../api/Api";

const aiApi = {
  getMyAnalyses: () =>
    Api.get("/ai/analyses"),

  getResumeAnalysis: (resumeId) =>
    Api.post("/ai/resume-analysis", {
      resumeId,
    }),

  getJobMatching: (jobId, resumeId) =>
    Api.post("/ai/job-matching", {
      jobId,
      resumeId,
    }),

  getJobRecommendations: ({
    resumeId,
    candidateProfile = {},
  }) =>
    Api.post("/ai/recommendations", {
      resumeId,
      candidateProfile,
    }),

  getSkillGap: (jobId, resumeId) =>
    Api.post("/ai/skill-gap", {
      jobId,
      resumeId,
    }),

  getInterviewPreparation: ({
    jobId,
    resumeId,
    candidateProfile = {},
  }) =>
    Api.post("/ai/interview-preparation", {
      jobId,
      resumeId,
      candidateProfile,
    }),
};

export default aiApi;

