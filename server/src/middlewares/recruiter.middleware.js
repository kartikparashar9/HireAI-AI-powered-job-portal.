import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";
import { ROLES } from "../constants/roles.js";
import { RECRUITER_STATUSES } from "../constants/recruiterStatus.js";
import asyncHandler from "../utils/asyncHandler.js";

const requireApprovedRecruiter = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    throw new ApiError(401, "Authentication required");
  }

  if (req.user.role !== ROLES.RECRUITER) {
    throw new ApiError(403, "Recruiter access required");
  }

  const user = await User.findById(req.user.userId).select(
    "role recruiterStatus isActive",
  );

  if (!user) {
    throw new ApiError(401, "User account not found");
  }

  if (!user.isActive) {
    throw new ApiError(403, "Your account is inactive");
  }

  if (user.role !== ROLES.RECRUITER) {
    throw new ApiError(403, "Recruiter access required");
  }

  if (user.recruiterStatus === RECRUITER_STATUSES.PENDING) {
    throw new ApiError(
      403,
      "Your recruiter account is awaiting admin approval",
    );
  }

  if (user.recruiterStatus === RECRUITER_STATUSES.REJECTED) {
    throw new ApiError(403, "Your recruiter account has been rejected");
  }

  if (user.recruiterStatus !== RECRUITER_STATUSES.APPROVED) {
    throw new ApiError(403, "Your recruiter account is not approved");
  }

  req.recruiter = user;

  next();
});

export default requireApprovedRecruiter;