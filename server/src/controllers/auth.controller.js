import User from "../models/User.js";

import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

import {
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
} from "../services/auth/auth.service.js";

import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  generateRandomToken,
  hashToken,
} from "../services/auth/token.service.js";

import verifyGoogleIdToken from "../services/auth/googleService.js";

import {
  sendVerificationEmail,
  sendPasswordResetEmail,
} from "../services/email/email.service.js";

import env from "../config/env.js";

// const VERIFICATION_TOKEN_EXPIRY_MS = 60 * 1000;

// const MAX_VERIFICATION_RESENDS = 5;

// const VERIFICATION_RESEND_WINDOW_MS = 60 * 60 * 1000;

const createAuthResponse = (user) => {
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  return {
    accessToken,
    refreshToken,
  };
};

const setRefreshCookie = (res, refreshToken) => {
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: env.nodeEnv === "production",
    sameSite: env.nodeEnv === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

const clearRefreshCookie = (res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: env.nodeEnv === "production",
    sameSite: env.nodeEnv === "production" ? "none" : "lax",
  });
};

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  recruiterStatus: user.recruiterStatus,
  avatar: user.avatar,
  isEmailVerified: user.isEmailVerified,
  isActive: user.isActive,
});

const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  const { user, verificationToken } = await registerUser({
    name,
    email,
    password,
    role,
  });

  const verificationUrl = `${env.clientUrl}/verify-email?token=${verificationToken}`;

  try {
    await sendVerificationEmail(user.email, verificationUrl);
  } catch (error) {
    console.error("Verification email failed:", error.message);
  }

  return res.status(201).json(
    new ApiResponse(
      201,
      {
        user: sanitizeUser(user),
      },
      "Registration successful. Please verify your email.",
    ),
  );
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await findUserByEmail(email);

  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  if (!user.isActive) {
    throw new ApiError(403, "Your account is inactive");
  }

  if (!user.password) {
    throw new ApiError(
      400,
      "This account uses Google Login. Please continue with Google.",
    );
  }

  await verifyPassword(user, password);

  const { accessToken, refreshToken } = createAuthResponse(user);

  user.refreshToken = hashToken(refreshToken);

  await user.save();

  setRefreshCookie(res, refreshToken);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        user: sanitizeUser(user),
        accessToken,
      },
      "Login successful",
    ),
  );
});

const googleLogin = asyncHandler(async (req, res) => {
  const { idToken } = req.body;

  const googleUser = await verifyGoogleIdToken(idToken);

  if (!googleUser.emailVerified) {
    throw new ApiError(400, "Google email is not verified");
  }

  let user = await findUserByGoogleId(googleUser.googleId);

  if (!user) {
    user = await findUserByEmailForGoogle(googleUser.email);

    if (user) {
      user.googleId = googleUser.googleId;

      user.isEmailVerified = true;

      if (!user.avatar && googleUser.avatar) {
        user.avatar = googleUser.avatar;
      }

      await user.save();
    }
  }

  if (!user) {
    user = await createGoogleUser(googleUser);
  }

  if (!user.isActive) {
    throw new ApiError(403, "Your account is inactive");
  }

  const { accessToken, refreshToken } = createAuthResponse(user);

  user.refreshToken = hashToken(refreshToken);

  await user.save();

  setRefreshCookie(res, refreshToken);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        user: sanitizeUser(user),
        accessToken,
      },
      "Google login successful",
    ),
  );
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    throw new ApiError(401, "Refresh token is required");
  }

  let decoded;

  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch {
    clearRefreshCookie(res);

    throw new ApiError(401, "Invalid or expired refresh token");
  }

  const user = await getUserById(decoded.userId, {
    includeRefreshToken: true,
  });

  if (!user.isActive) {
    clearRefreshCookie(res);

    throw new ApiError(403, "Your account is inactive");
  }

  const hashedRefreshToken = hashToken(refreshToken);

  if (!user.refreshToken || user.refreshToken !== hashedRefreshToken) {
    clearRefreshCookie(res);

    throw new ApiError(401, "Invalid refresh token");
  }

  const newAccessToken = generateAccessToken(user);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        accessToken: newAccessToken,
      },
      "Access token refreshed",
    ),
  );
});

const logout = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (refreshToken) {
    try {
      const decoded = verifyRefreshToken(refreshToken);

      await User.updateOne(
        {
          _id: decoded.userId,
        },
        {
          $set: {
            refreshToken: null,
          },
        },
      );
    } catch {
      // Token is already invalid.
    }
  }

  clearRefreshCookie(res);

  return res.status(200).json(new ApiResponse(200, null, "Logout successful"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await getUserById(req.user.userId);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        user: sanitizeUser(user),
      },
      "Current user fetched",
    ),
  );
});

const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.body;

  const hashedToken = hashToken(token);

  const user = await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpires: {
      $gt: new Date(),
    },
  }).select("+emailVerificationToken");

  if (!user) {
    throw new ApiError(400, "Invalid or expired verification token");
  }

  await markEmailVerified(user);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Email verified successfully"));
});

const resendVerificationEmail = asyncHandler(async (req, res) => {
  const normalizedEmail = req.body.email.trim().toLowerCase();

  const user = await User.findOne({
    email: normalizedEmail,
  }).select("+emailVerificationToken");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (user.isEmailVerified) {
    throw new ApiError(400, "Email is already verified");
  }

  const now = Date.now();

  let resendCount = user.emailVerificationResendCount || 0;

  let windowStart = user.emailVerificationResendWindowStart;

  /*
   * If there is no window or the current
   * one-hour window has expired, start
   * a new window.
   */
  if (
    !windowStart ||
    now - new Date(windowStart).getTime() >= RESEND_WINDOW_MS
  ) {
    resendCount = 0;
    windowStart = new Date(now);
  }

  if (resendCount >= MAX_RESEND_ATTEMPTS) {
    const remainingMs =
      RESEND_WINDOW_MS - (now - new Date(windowStart).getTime());

    const remainingMinutes = Math.ceil(remainingMs / (60 * 1000));

    throw new ApiError(
      429,
      `Maximum verification resend limit reached. Please try again in approximately ${remainingMinutes} minute(s).`,
    );
  }

  const rawToken = generateRandomToken();

  user.emailVerificationToken = hashToken(rawToken);
  user.emailVerificationExpires = new Date(now + VERIFICATION_TOKEN_EXPIRY_MS);
  user.emailVerificationResendCount = resendCount + 1;
  user.emailVerificationResendWindowStart = windowStart;
  await user.save();

  const verificationUrl = `${env.clientUrl}/verify-email?token=${rawToken}`;

  await sendVerificationEmail(user.email, verificationUrl);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        resendCount: user.emailVerificationResendCount,
        remainingResends:
          MAX_RESEND_ATTEMPTS - user.emailVerificationResendCount,
        expiresInSeconds: 60,
      },
      "Verification email sent",
    ),
  );
});

const forgotPassword = asyncHandler(async (req, res) => {
  const email = req.body.email.trim().toLowerCase();

  const user = await User.findOne({
    email,
  }).select("+resetPasswordToken");

  // Don't reveal whether the email exists.
  if (!user) {
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          null,
          "If the email exists, a password reset link has been sent",
        ),
      );
  }

  if (!user.password) {
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          null,
          "If the email exists, a password reset link has been sent",
        ),
      );
  }

  const rawToken = generateRandomToken();

  user.resetPasswordToken = hashToken(rawToken);

  user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000);

  await user.save();

  const resetUrl = `${env.clientUrl}/reset-password?token=${rawToken}`;

  await sendPasswordResetEmail(user.email, resetUrl);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        null,
        "If the email exists, a password reset link has been sent",
      ),
    );
});

const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;

  const hashedToken = hashToken(token);

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: {
      $gt: new Date(),
    },
  }).select("+resetPasswordToken +refreshToken");

  if (!user) {
    throw new ApiError(400, "Invalid or expired reset token");
  }

  user.password = password;

  user.passwordChangedAt = new Date();

  user.resetPasswordToken = null;

  user.resetPasswordExpires = null;

  // Invalidate current login sessions.
  user.refreshToken = null;

  await user.save();

  clearRefreshCookie(res);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Password reset successful"));
});

const changeUserPassword = asyncHandler(async (req, res) => {
  await changePassword(
    req.user.userId,
    req.body.currentPassword,
    req.body.newPassword,
  );

  clearRefreshCookie(res);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        null,
        "Password changed successfully. Please login again.",
      ),
    );
});

export {
  register,
  login,
  googleLogin,
  refreshAccessToken,
  logout,
  getCurrentUser,
  verifyEmail,
  resendVerificationEmail,
  forgotPassword,
  resetPassword,
  changeUserPassword,
};
