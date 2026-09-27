import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

import {
  createResume,
  getMyResumes,
  getResumeById,
  setPrimaryResume,
  deleteResume,
} from "../services/resume/resume.service.js";

const uploadMyResume = asyncHandler(async (req, res) => {
  const resume = await createResume(req.user.userId, {
    title: req.body.title,
    file: req.file,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, resume, "Resume uploaded successfully"));
});

const getMyResumesController = asyncHandler(async (req, res) => {
  const resumes = await getMyResumes(req.user.userId);

  return res
    .status(200)
    .json(new ApiResponse(200, resumes, "Resumes fetched successfully"));
});

const getMyResumeById = asyncHandler(async (req, res) => {
  const resume = await getResumeById(req.user.userId, req.params.id);

  return res
    .status(200)
    .json(new ApiResponse(200, resume, "Resume fetched successfully"));
});

const makeResumePrimary = asyncHandler(async (req, res) => {
  const resume = await setPrimaryResume(req.user.userId, req.params.id);

  return res
    .status(200)
    .json(new ApiResponse(200, resume, "Primary resume updated successfully"));
});

const removeMyResume = asyncHandler(async (req, res) => {
  await deleteResume(req.user.userId, req.params.id);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Resume deleted successfully"));
});

export {
  uploadMyResume,
  getMyResumesController,
  getMyResumeById,
  makeResumePrimary,
  removeMyResume,
};
