import asyncHandler from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/ApiResponse.js";

import {
  getAllRecruiters,
  getPendingRecruiters,
  approveRecruiter,
  rejectRecruiter,
} from "../../services/admin/recruiter.service.js";

const getAllRecruitersController = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, search = "", status = "" } = req.query;

  const result = await getAllRecruiters({
    page,
    limit,
    search,
    status,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, result, "Recruiters fetched successfully"));
});

const getPendingRecruitersController = asyncHandler(async (req, res) => {
  const recruiters = await getPendingRecruiters();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        recruiters,
        "Pending recruiters fetched successfully",
      ),
    );
});

const approveRecruiterController = asyncHandler(async (req, res) => {
  const recruiter = await approveRecruiter(req.params.id);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        id: recruiter._id,
        name: recruiter.name,
        email: recruiter.email,
        role: recruiter.role,
        recruiterStatus: recruiter.recruiterStatus,
      },
      "Recruiter approved successfully",
    ),
  );
});

const rejectRecruiterController = asyncHandler(async (req, res) => {
  const recruiter = await rejectRecruiter(req.params.id);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        id: recruiter._id,
        name: recruiter.name,
        email: recruiter.email,
        role: recruiter.role,
        recruiterStatus: recruiter.recruiterStatus,
      },
      "Recruiter rejected successfully",
    ),
  );
});

export {
  getAllRecruitersController,
  getPendingRecruitersController,
  approveRecruiterController,
  rejectRecruiterController,
};
