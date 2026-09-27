import {
  getAllUsers,
  getUserById,
  updateUserStatus,
  deleteUser,
} from "../../services/admin/adminUser.service.js";

import ApiResponse from "../../utils/ApiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";

const getAllUsersController = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, search = "", role = "", isActive } = req.query;

  const result = await getAllUsers({
    page,
    limit,
    search,
    role,
    isActive,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, result, "Users fetched successfully"));
});

const getUserByIdController = asyncHandler(async (req, res) => {
  const user = await getUserById(req.params.id);

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User fetched successfully"));
});

const updateUserStatusController = asyncHandler(async (req, res) => {
  const { isActive } = req.body;

  const user = await updateUserStatus(req.params.id, isActive, req.user._id);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        user,
        `User ${isActive ? "activated" : "deactivated"} successfully`,
      ),
    );
});

const deleteUserController = asyncHandler(async (req, res) => {
  await deleteUser(req.params.id, req.user._id);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "User deleted successfully"));
});

export {
  getAllUsersController,
  getUserByIdController,
  updateUserStatusController,
  deleteUserController,
};