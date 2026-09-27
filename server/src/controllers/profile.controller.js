import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

import {
  createProfile,
  getProfileByUserId,
  updateProfile,
  deleteProfile,
} from "../services/profile/profile.service.js";

const createMyProfile = asyncHandler(async (req, res) => {
  const profile = await createProfile(req.user.userId, req.body);

  return res
    .status(201)
    .json(new ApiResponse(201, profile, "Profile created successfully"));
});

const getMyProfile = asyncHandler(async (req, res) => {
  const profile = await getProfileByUserId(req.user.userId);

  return res
    .status(200)
    .json(new ApiResponse(200, profile, "Profile fetched successfully"));
});

const updateMyProfile = asyncHandler(async (req, res) => {
  const profile = await updateProfile(req.user.userId, req.body);

  return res
    .status(200)
    .json(new ApiResponse(200, profile, "Profile updated successfully"));
});

const deleteMyProfile = asyncHandler(async (req, res) => {
  await deleteProfile(req.user.userId);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Profile deleted successfully"));
});

export { createMyProfile, getMyProfile, updateMyProfile, deleteMyProfile };