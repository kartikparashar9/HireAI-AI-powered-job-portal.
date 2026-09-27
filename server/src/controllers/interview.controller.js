import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

import {
  createInterview,
  getMyInterviews,
  getInterviewById,
  updateInterview,
  updateInterviewByCandidate,
  cancelInterview,
  completeInterview,
} from "../services/interviews/interview.service.js";

const createInterviewController = asyncHandler(async (req, res) => {
  const interview = await createInterview(req.user.userId, req.body);

  return res
    .status(201)
    .json(new ApiResponse(201, interview, "Interview scheduled successfully"));
});

const getMyInterviewsController = asyncHandler(async (req, res) => {
  const interviews = await getMyInterviews(req.user.userId, req.user.role);

  return res
    .status(200)
    .json(new ApiResponse(200, interviews, "Interviews fetched successfully"));
});

const getInterviewByIdController = asyncHandler(async (req, res) => {
  const interview = await getInterviewById(
    req.user.userId,
    req.user.role,
    req.params.id,
  );

  return res
    .status(200)
    .json(new ApiResponse(200, interview, "Interview fetched successfully"));
});

const updateInterviewController = asyncHandler(async (req, res) => {
  const interview = await updateInterview(
    req.user.userId,
    req.params.id,
    req.body,
  );

  return res
    .status(200)
    .json(new ApiResponse(200, interview, "Interview updated successfully"));
});

const updateInterviewByCandidateController = asyncHandler(async (req, res) => {
  const interview = await updateInterviewByCandidate(
    req.user.userId,
    req.params.id,
    req.body.status,
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        interview,
        "Interview response updated successfully",
      ),
    );
});

const cancelInterviewController = asyncHandler(async (req, res) => {
  const interview = await cancelInterview(
    req.user.userId,
    req.user.role,
    req.params.id,
  );

  return res
    .status(200)
    .json(new ApiResponse(200, interview, "Interview cancelled successfully"));
});

const completeInterviewController = asyncHandler(async (req, res) => {
  const interview = await completeInterview(req.user.userId, req.params.id);

  return res
    .status(200)
    .json(new ApiResponse(200, interview, "Interview marked as completed"));
});

export {
  createInterviewController,
  getMyInterviewsController,
  getInterviewByIdController,
  updateInterviewController,
  updateInterviewByCandidateController,
  cancelInterviewController,
  completeInterviewController,
};