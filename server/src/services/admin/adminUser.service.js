import User from "../../models/User.js";
import ApiError from "../../utils/ApiError.js";

const getAllUsers = async ({
  page = 1,
  limit = 20,
  search = "",
  role = "",
  isActive,
}) => {
  const safePage = Math.max(Number(page) || 1, 1);

  const safeLimit = Math.min(Math.max(Number(limit) || 20, 1), 50);

  const skip = (safePage - 1) * safeLimit;

  const filter = {};

  // Search by name or email
  if (search?.trim()) {
    const searchRegex = new RegExp(search.trim(), "i");

    filter.$or = [{ name: searchRegex }, { email: searchRegex }];
  }

  // Filter by role
  if (role) {
    filter.role = role;
  }

  // Filter by active status
  if (isActive !== undefined) {
    filter.isActive = isActive === true || isActive === "true";
  }

  const [users, total] = await Promise.all([
    User.find(filter)
      .select("-password -emailVerificationToken -resetPasswordToken")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(safeLimit)
      .lean(),

    User.countDocuments(filter),
  ]);

  return {
    users,
    pagination: {
      page: safePage,
      limit: safeLimit,
      total,
      totalPages: Math.ceil(total / safeLimit),
    },
  };
};

const getUserById = async (userId) => {
  const user = await User.findById(userId)
    .select("-password -emailVerificationToken -resetPasswordToken")
    .lean();

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return user;
};

const updateUserStatus = async (userId, isActive, adminId) => {
  if (userId.toString() === adminId.toString()) {
    throw new ApiError(400, "You cannot change your own account status");
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  user.isActive = isActive;

  await user.save();

  return user;
};

const deleteUser = async (userId, adminId) => {
  if (userId.toString() === adminId.toString()) {
    throw new ApiError(400, "You cannot delete your own account");
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  await User.findByIdAndDelete(userId);

  return true;
};

export { getAllUsers, getUserById, updateUserStatus, deleteUser };