import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

import {
  createJob,
  getMyJobs,
  getJobById,
  updateJob,
  deleteJob,
} from "../services/jobs/job.service.js";

import {
  searchJobs,
  getFeaturedJobs,
} from "../services/jobs/jobSearch.service.js";

const createJobController = asyncHandler(async (req, res) => {
  const job = await createJob(req.user.userId, req.body);

  return res
    .status(201)
    .json(new ApiResponse(201, job, "Job created successfully"));
});

const getMyJobsController = asyncHandler(async (req, res) => {
  const jobs = await getMyJobs(req.user.userId);

  return res
    .status(200)
    .json(new ApiResponse(200, jobs, "Jobs fetched successfully"));
});

const getJobByIdController = asyncHandler(async (req, res) => {
  const job = await getJobById(req.params.id);

  return res
    .status(200)
    .json(new ApiResponse(200, job, "Job fetched successfully"));
});

const updateJobController = asyncHandler(async (req, res) => {
  const job = await updateJob(req.user.userId, req.params.id, req.body);

  return res
    .status(200)
    .json(new ApiResponse(200, job, "Job updated successfully"));
});

const deleteJobController = asyncHandler(async (req, res) => {
  await deleteJob(req.user.userId, req.params.id);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Job deleted successfully"));
});

const searchJobsController = asyncHandler(async (req, res) => {
  const result = await searchJobs(req.query);

  return res
    .status(200)
    .json(new ApiResponse(200, result, "Jobs fetched successfully"));
});

const getFeaturedJobsController = asyncHandler(async (req, res) => {
  const limit = Number(req.query.limit) || 6;

  const jobs = await getFeaturedJobs(limit);

  return res
    .status(200)
    .json(new ApiResponse(200, jobs, "Featured jobs fetched successfully"));
});

export {
  createJobController,
  getMyJobsController,
  getJobByIdController,
  updateJobController,
  deleteJobController,
  searchJobsController,
  getFeaturedJobsController,
};
