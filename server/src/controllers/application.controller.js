import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

import {
  applyToJob,
  getMyApplications,
  getApplicationById,
  withdrawApplication,
  getJobApplications,
  getShortlistedApplications,
  updateApplicationStatus,
} from "../services/applications/application.service.js";

const applyToJobController = asyncHandler(async (req, res) => {
  const application = await applyToJob(
    req.user.userId,
    req.params.jobId,
    req.body,
  );

  return res
    .status(201)
    .json(
      new ApiResponse(201, application, "Application submitted successfully"),
    );
});

const getMyApplicationsController = asyncHandler(async (req, res) => {
  const applications = await getMyApplications(req.user.userId);

  return res
    .status(200)
    .json(
      new ApiResponse(200, applications, "Applications fetched successfully"),
    );
});

const getApplicationByIdController = asyncHandler(async (req, res) => {
  const application = await getApplicationById(req.user.userId, req.params.id);

  return res
    .status(200)
    .json(
      new ApiResponse(200, application, "Application fetched successfully"),
    );
});

const withdrawApplicationController = asyncHandler(async (req, res) => {
  const application = await withdrawApplication(req.user.userId, req.params.id);

  return res
    .status(200)
    .json(
      new ApiResponse(200, application, "Application withdrawn successfully"),
    );
});

const getJobApplicationsController = asyncHandler(async (req, res) => {
  const applications = await getJobApplications(
    req.user.userId,
    req.params.jobId,
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        applications,
        "Job applications fetched successfully",
      ),
    );
});

const getShortlistedApplicationsController = asyncHandler(async (req, res) => {
  const applications = await getShortlistedApplications(req.user.userId);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        applications,
        "Shortlisted applications fetched successfully",
      ),
    );
});

const updateApplicationStatusController = asyncHandler(async (req, res) => {
  const application = await updateApplicationStatus(
    req.user.userId,
    req.params.id,
    req.body.status,
    req.body.recruiterNote,
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        application,
        "Application status updated successfully",
      ),
    );
});

export {
  applyToJobController,
  getMyApplicationsController,
  getApplicationByIdController,
  withdrawApplicationController,
  getJobApplicationsController,
  getShortlistedApplicationsController,
  updateApplicationStatusController,
};
