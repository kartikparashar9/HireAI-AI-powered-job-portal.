import Api from "../../../api/Api";

const recruiterApi = {
  // =====================================================
  // PROFILE
  // =====================================================

  getProfile: async () => {
    return await Api.get("/profile/me");
  },

  createProfile: async (profileData) => {
    return await Api.post("/profile", profileData);
  },

  updateProfile: async (profileData) => {
    return await Api.patch("/profile/me", profileData);
  },

  // =====================================================
  // COMPANY
  // =====================================================

  getMyCompany: async () => {
    return await Api.get("/company/my");
  },

  getCompanyById: async (companyId) => {
    return await Api.get(`/company/${companyId}`);
  },

  createCompany: async (companyData) => {
    return await Api.post("/company", companyData);
  },

  updateCompany: async (companyId, companyData) => {
    return await Api.patch(`/company/${companyId}`, companyData);
  },

  deleteCompany: async (companyId) => {
    return await Api.delete(`/company/${companyId}`);
  },

  // =====================================================
  // JOBS
  // =====================================================

  getMyJobs: async () => {
    return await Api.get("/jobs/my");
  },

  getJobById: async (jobId) => {
    return await Api.get(`/jobs/${jobId}`);
  },

  createJob: async (jobData) => {
    return await Api.post("/jobs", jobData);
  },

  updateJob: async (jobId, jobData) => {
    return await Api.patch(`/jobs/${jobId}`, jobData);
  },

  deleteJob: async (jobId) => {
    return await Api.delete(`/jobs/${jobId}`);
  },

  // =====================================================
  // APPLICATIONS
  // =====================================================

  getJobApplications: async (jobId) => {
    return await Api.get(`/applications/jobs/${jobId}`);
  },

  updateApplicationStatus: async (applicationId, data) => {
    return await Api.patch(`/applications/${applicationId}/status`, data);
  },

  getShortlistedApplications: async () => {
    return  await Api.get("/applications/shortlisted");
  },
  // =====================================================
  // INTERVIEWS
  // =====================================================

  getMyInterviews: async () => {
    return await Api.get("/interviews/my");
  },

  getInterviewById: async (interviewId) => {
    return await Api.get(`/interviews/${interviewId}`);
  },

  createInterview: async (interviewData) => {
    return await Api.post("/interviews", interviewData);
  },

  updateInterview: async (interviewId, interviewData) => {
    return await Api.patch(`/interviews/${interviewId}`, interviewData);
  },

  completeInterview: async (interviewId, data = {}) => {
    return await Api.patch(`/interviews/${interviewId}/complete`, data);
  },

  cancelInterview: async (interviewId, data = {}) => {
    return await Api.patch(`/interviews/${interviewId}/cancel`, data);
  },
};

export default recruiterApi;
