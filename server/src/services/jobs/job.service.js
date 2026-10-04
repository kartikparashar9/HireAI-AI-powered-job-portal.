import Job from "../../models/Job.js";
import Company from "../../models/Company.js";
import ApiError from "../../utils/ApiError.js";
import { JOB_STATUSES } from "../../constants/jobStatus.js";

const createJob = async (recruiterId, jobData) => {
  const {
    experienceMin = 0,
    experienceMax = 0,
    salaryMin = 0,
    salaryMax = 0,
    applicationDeadline,
    ...rest
  } = jobData;

  const recruiterCompany = await Company.findOne({
    recruiter: recruiterId,
  });

  if (!recruiterCompany) {
    throw new ApiError(
      404,
      "Please create your company profile before posting a job",
    );
  }

  if (experienceMax < experienceMin) {
    throw new ApiError(
      400,
      "Maximum experience cannot be less than minimum experience",
    );
  }

  if (salaryMax < salaryMin) {
    throw new ApiError(
      400,
      "Maximum salary cannot be less than minimum salary",
    );
  }

  if (applicationDeadline && new Date(applicationDeadline) <= new Date()) {
    throw new ApiError(400, "Application deadline must be in the future");
  }

  const skills = Array.isArray(rest.skills)
    ? rest.skills.map((skill) => String(skill).trim()).filter(Boolean)
    : [];

  if (skills.length === 0) {
    throw new ApiError(400, "At least one skill is required");
  }

  const job = await Job.create({
    ...rest,

    skills,

    company: recruiterCompany._id,

    recruiter: recruiterId,

    experienceMin,
    experienceMax,

    salaryMin,
    salaryMax,

    applicationDeadline: applicationDeadline || null,

    status: JOB_STATUSES.OPEN,
  });

  return job;
};

const getMyJobs = async (recruiterId) => {
  return Job.find({
    recruiter: recruiterId,
  })
    .populate("company", "name logo website")
    .sort({ createdAt: -1 });
};

const getJobById = async (jobId) => {
  const job = await Job.findById(jobId)
    .populate("company", "name logo website industry companySize location")
    .populate("recruiter", "name email");

  if (!job) {
    throw new ApiError(404, "Job not found");
  }

  return job;
};

const updateJob = async (recruiterId, jobId, jobData) => {
  const job = await Job.findOne({
    _id: jobId,
    recruiter: recruiterId,
  });

  if (!job) {
    throw new ApiError(
      404,
      "Job not found or you are not authorized to update it",
    );
  }

  const nextExperienceMin = jobData.experienceMin ?? job.experienceMin;

  const nextExperienceMax = jobData.experienceMax ?? job.experienceMax;

  const nextSalaryMin = jobData.salaryMin ?? job.salaryMin;

  const nextSalaryMax = jobData.salaryMax ?? job.salaryMax;

  if (nextExperienceMax < nextExperienceMin) {
    throw new ApiError(
      400,
      "Maximum experience cannot be less than minimum experience",
    );
  }

  if (nextSalaryMax < nextSalaryMin) {
    throw new ApiError(
      400,
      "Maximum salary cannot be less than minimum salary",
    );
  }

  if (
    jobData.applicationDeadline &&
    new Date(jobData.applicationDeadline) <= new Date()
  ) {
    throw new ApiError(400, "Application deadline must be in the future");
  }

  if (jobData.company) {
    const recruiterCompany = await Company.findOne({
      _id: jobData.company,
      recruiter: recruiterId,
    });

    if (!recruiterCompany) {
      throw new ApiError(403, "You can only assign jobs to your own company");
    }
  }

  const updateData = {
    ...jobData,
    experienceMin: nextExperienceMin,
    experienceMax: nextExperienceMax,
    salaryMin: nextSalaryMin,
    salaryMax: nextSalaryMax,
  };

  if (jobData.skills) {
    updateData.skills = jobData.skills.map((skill) => skill.trim());
  }

  Object.assign(job, updateData);

  await job.save();

  return job;
};

const deleteJob = async (recruiterId, jobId) => {
  const job = await Job.findOne({
    _id: jobId,
    recruiter: recruiterId,
  });

  if (!job) {
    throw new ApiError(
      404,
      "Job not found or you are not authorized to delete it",
    );
  }

  await job.deleteOne();

  return job;
};

export { createJob, getMyJobs, getJobById, updateJob, deleteJob };
