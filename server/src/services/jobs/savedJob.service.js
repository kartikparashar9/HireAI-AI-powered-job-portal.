import SavedJob from "../../models/SavedJob.js";
import Job from "../../models/Job.js";
import ApiError from "../../utils/ApiError.js";

const saveJob = async (userId, jobId) => {
  const job = await Job.findById(jobId);

  if (!job) {
    throw new ApiError(404, "Job not found");
  }

  const existingSavedJob = await SavedJob.findOne({
    user: userId,
    job: jobId,
  });

  if (existingSavedJob) {
    throw new ApiError(409, "Job is already saved");
  }

  const savedJob = await SavedJob.create({
    user: userId,
    job: jobId,
  });

  return savedJob;
};

const getSavedJobs = async (userId) => {
  return SavedJob.find({
    user: userId,
  })
    .populate({
      path: "job",
      populate: {
        path: "company",
        select: "name logo website industry location",
      },
    })
    .sort({ createdAt: -1 });
};

const removeSavedJob = async (userId, jobId) => {
  const savedJob = await SavedJob.findOneAndDelete({
    user: userId,
    job: jobId,
  });

  if (!savedJob) {
    throw new ApiError(404, "Saved job not found");
  }

  return savedJob;
};

const isJobSaved = async (userId, jobId) => {
  const savedJob = await SavedJob.exists({
    user: userId,
    job: jobId,
  });

  return Boolean(savedJob);
};

export { saveJob, getSavedJobs, removeSavedJob, isJobSaved };
