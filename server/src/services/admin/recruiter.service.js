import User from "../../models/User.js";
import ApiError from "../../utils/ApiError.js";
import { ROLES } from "../../constants/roles.js";
import { RECRUITER_STATUSES } from "../../constants/recruiterStatus.js";

const getAllRecruiters = async ({
  page = 1,
  limit = 20,
  search = "",
  status = "",
}) => {
  const safePage = Math.max(Number(page) || 1, 1);

  const safeLimit = Math.min(Math.max(Number(limit) || 20, 1), 50);

  const skip = (safePage - 1) * safeLimit;

  const filter = {
    role: ROLES.RECRUITER,
  };

  if (status) {
    filter.recruiterStatus = status;
  }

  if (search?.trim()) {
    const searchRegex = new RegExp(search.trim(), "i");

    filter.$or = [{ name: searchRegex }, { email: searchRegex }];
  }

  const [recruiters, total] = await Promise.all([
    User.find(filter)
      .select(
        "name email role recruiterStatus avatar isEmailVerified isActive createdAt updatedAt",
      )
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(safeLimit)
      .lean(),

    User.countDocuments(filter),
  ]);

  return {
    recruiters,
    pagination: {
      page: safePage,
      limit: safeLimit,
      total,
      totalPages: Math.ceil(total / safeLimit),
    },
  };
};

const getPendingRecruiters = async () => {
  return User.find({
    role: ROLES.RECRUITER,
    recruiterStatus: RECRUITER_STATUSES.PENDING,
  })
    .select("name email recruiterStatus isEmailVerified isActive createdAt")
    .sort({ createdAt: -1 });
};

const approveRecruiter = async (recruiterId) => {
  const recruiter = await User.findOne({
    _id: recruiterId,
    role: ROLES.RECRUITER,
  });

  if (!recruiter) {
    throw new ApiError(404, "Recruiter not found");
  }

  if (recruiter.recruiterStatus !== RECRUITER_STATUSES.PENDING) {
    throw new ApiError(
      400,
      `Recruiter is already ${recruiter.recruiterStatus?.toLowerCase() || "not pending"}`,
    );
  }

  recruiter.recruiterStatus = RECRUITER_STATUSES.APPROVED;
  await recruiter.save();

  return recruiter;
};

const rejectRecruiter = async (recruiterId) => {
  const recruiter = await User.findOne({
    _id: recruiterId,
    role: ROLES.RECRUITER,
  });

  if (!recruiter) {
    throw new ApiError(404, "Recruiter not found");
  }

  if (recruiter.recruiterStatus !== RECRUITER_STATUSES.PENDING) {
    throw new ApiError(
      400,
      `Recruiter is already ${recruiter.recruiterStatus?.toLowerCase() || "not pending"}`,
    );
  }

  recruiter.recruiterStatus = RECRUITER_STATUSES.REJECTED;
  await recruiter.save();

  return recruiter;
};

export { getAllRecruiters, getPendingRecruiters, approveRecruiter, rejectRecruiter };
