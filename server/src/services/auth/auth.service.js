import User from "../../models/User.js";
import ApiError from "../../utils/ApiError.js";
import { ROLES } from "../../constants/roles.js";
import { generateRandomToken, hashToken } from "./token.service.js";
import { RECRUITER_STATUSES } from "../../constants/recruiterStatus.js";

const VERIFICATION_TOKEN_EXPIRY_MS = 60 * 1000;
const MAX_RESEND_ATTEMPTS = 5;
const RESEND_WINDOW_MS = 60 * 60 * 1000;

const registerUser = async ({ name, email, password, role }) => {
  const normalizedEmail = email.trim().toLowerCase();

  const existingUser = await User.findOne({
    email: normalizedEmail,
  });

  if (existingUser) {
    throw new ApiError(409, "Email is already registered");
  }

  const allowedRole =
    role === ROLES.RECRUITER ? ROLES.RECRUITER : ROLES.JOB_SEEKER;

  const rawVerificationToken = generateRandomToken();

  const user = await User.create({
    name,
    email: normalizedEmail,
    password,
    role: allowedRole,

    recruiterStatus:
      allowedRole === ROLES.RECRUITER ? RECRUITER_STATUSES.PENDING : null,

    isEmailVerified: false,

    emailVerificationToken: hashToken(rawVerificationToken),

    emailVerificationExpires: new Date(
      Date.now() + VERIFICATION_TOKEN_EXPIRY_MS,
    ),

    // Initial verification email is not counted
    // as a resend attempt.
    emailVerificationResendCount: 0,

    emailVerificationResendWindowStart: new Date(),
  });

  return {
    user,
    verificationToken: rawVerificationToken,
  };
};

const findUserByEmail = async (email) => {
  return User.findOne({
    email: email.trim().toLowerCase(),
  }).select("+password +refreshToken");
};

const verifyPassword = async (user, password) => {
  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid email or password");
  }

  return true;
};

const getUserById = async (
  userId,
  {
    includePassword = false,
    includeRefreshToken = false,
    includeVerificationToken = false,
    includeResetToken = false,
  } = {},
) => {
  const query = User.findById(userId);

  const fields = [];

  if (includePassword) {
    fields.push("+password");
  }

  if (includeRefreshToken) {
    fields.push("+refreshToken");
  }

  if (includeVerificationToken) {
    fields.push("+emailVerificationToken");
  }

  if (includeResetToken) {
    fields.push("+resetPasswordToken");
  }

  if (fields.length) {
    query.select(fields.join(" "));
  }

  const user = await query;

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return user;
};

const findUserByGoogleId = async (googleId) => {
  return User.findOne({ googleId });
};

const findUserByEmailForGoogle = async (email) => {
  return User.findOne({
    email: email.trim().toLowerCase(),
  });
};

const createGoogleUser = async ({ name, email, googleId, avatar }) => {
  return User.create({
    name,
    email: email.trim().toLowerCase(),
    googleId,
    avatar: avatar || null,
    role: ROLES.JOB_SEEKER,
    isEmailVerified: true,
  });
};

const markEmailVerified = async (user) => {
  user.isEmailVerified = true;

  user.emailVerificationToken = null;

  user.emailVerificationExpires = null;

  user.emailVerificationResendCount = 0;

  user.emailVerificationResendWindowStart = null;

  await user.save();

  return user;
};

const changePassword = async (userId, currentPassword, newPassword) => {
  const user = await getUserById(userId, {
    includePassword: true,
  });

  if (!user.password) {
    throw new ApiError(
      400,
      "Google accounts do not have a password. Use Google Login.",
    );
  }

  const isCorrect = await user.comparePassword(currentPassword);

  if (!isCorrect) {
    throw new ApiError(401, "Current password is incorrect");
  }

  user.password = newPassword;

  user.passwordChangedAt = new Date();

  user.refreshToken = null;

  await user.save();

  return user;
};

export {
  registerUser,
  findUserByEmail,
  verifyPassword,
  getUserById,
  findUserByGoogleId,
  findUserByEmailForGoogle,
  createGoogleUser,
  markEmailVerified,
  changePassword,
  VERIFICATION_TOKEN_EXPIRY_MS,
  MAX_RESEND_ATTEMPTS,
  RESEND_WINDOW_MS,
};
