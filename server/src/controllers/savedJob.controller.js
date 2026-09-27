import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

import {
  saveJob,
  getSavedJobs,
  removeSavedJob,
  isJobSaved,
} from "../services/jobs/savedJob.service.js";

const saveJobController = asyncHandler(async (req, res) => {
  const savedJob = await saveJob(req.user.userId, req.params.jobId);

  return res
    .status(201)
    .json(new ApiResponse(201, savedJob, "Job saved successfully"));
});

const getSavedJobsController = asyncHandler(async (req, res) => {
  const savedJobs = await getSavedJobs(req.user.userId);

  return res
    .status(200)
    .json(new ApiResponse(200, savedJobs, "Saved jobs fetched successfully"));
});

const removeSavedJobController = asyncHandler(async (req, res) => {
  await removeSavedJob(req.user.userId, req.params.jobId);

  return res
    .status(200)
    .json(
      new ApiResponse(200, null, "Job removed from saved jobs successfully"),
    );
});

const checkSavedJobController = asyncHandler(async (req, res) => {
  const isSaved = await isJobSaved(req.user.userId, req.params.jobId);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { isSaved },
        "Saved job status fetched successfully",
      ),
    );
});

export {
  saveJobController,
  getSavedJobsController,
  removeSavedJobController,
  checkSavedJobController,
};
