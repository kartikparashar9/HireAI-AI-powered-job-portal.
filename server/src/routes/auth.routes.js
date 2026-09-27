import { Router } from "express";

import {
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
} from "../controllers/auth.controller.js";

import authMiddleware from "../middlewares/auth.middleware.js";
import validateRequest from "../middlewares/validate.middleware.js";

import {
  registerValidator,
  loginValidator,
  googleLoginValidator,
  emailValidator,
  verifyEmailValidator,
  resetPasswordValidator,
  changePasswordValidator,
} from "../validators/auth.validator.js";

import {
  authLimiter,
  passwordResetLimiter
} from "../middlewares/rateLimiter.middleware.js"

const router = Router();

router.post(
  "/signup",
  authLimiter,
  registerValidator,
  validateRequest,
  register,
);

router.post("/login", authLimiter, loginValidator, validateRequest, login);

router.post(
  "/google",
  authLimiter,
  googleLoginValidator,
  validateRequest,
  googleLogin,
);

router.post("/refresh", refreshAccessToken);

router.post("/logout", logout);

router.get("/me", authMiddleware, getCurrentUser);

router.post(
  "/verify-email",
  verifyEmailValidator,
  validateRequest,
  verifyEmail,
);

router.post(
  "/resend-verification",
  authLimiter,
  emailValidator,
  validateRequest,
  resendVerificationEmail,
);

router.post(
  "/forgot-password",
  passwordResetLimiter,
  emailValidator,
  validateRequest,
  forgotPassword,
);

router.post(
  "/reset-password",
  passwordResetLimiter,
  resetPasswordValidator,
  validateRequest,
  resetPassword,
);

router.post(
  "/change-password",
  authMiddleware,
  changePasswordValidator,
  validateRequest,
  changeUserPassword,
);

export default router;
