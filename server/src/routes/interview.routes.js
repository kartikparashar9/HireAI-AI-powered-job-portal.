import { Router } from "express";
import rateLimit from "express-rate-limit";

import authMiddleware from "../middlewares/auth.middleware.js";
import authorizeRoles from "../middlewares/role.middleware.js";
import requireApprovedRecruiter from "../middlewares/recruiter.middleware.js";
import validateRequest from "../middlewares/validate.middleware.js";

import {
  createInterviewValidator,
  updateInterviewValidator,
} from "../validators/interview.validator.js";

import {
  createInterviewController,
  getMyInterviewsController,
  getInterviewByIdController,
  updateInterviewController,
  updateInterviewByCandidateController,
  cancelInterviewController,
  completeInterviewController,
} from "../controllers/interview.controller.js";

const router = Router();

const interviewReadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many interview requests. Please try again later.",
  },
});

const interviewWriteLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message:
      "Too many interview modification requests. Please try again later.",
  },
});

router.use(authMiddleware);

// ─────────────────────────────────────────────
// COMMON
// ─────────────────────────────────────────────

router.get(
  "/my",
  interviewReadLimiter,
  authorizeRoles("JOB_SEEKER", "RECRUITER"),
  getMyInterviewsController,
);

router.get(
  "/:id",
  interviewReadLimiter,
  authorizeRoles("JOB_SEEKER", "RECRUITER"),
  getInterviewByIdController,
);

// ─────────────────────────────────────────────
// RECRUITER
// ─────────────────────────────────────────────

router.post(
  "/",
  interviewWriteLimiter,
  authorizeRoles("RECRUITER"),
  requireApprovedRecruiter,
  createInterviewValidator,
  validateRequest,
  createInterviewController,
);

router.patch(
  "/:id",
  interviewWriteLimiter,
  authorizeRoles("RECRUITER"),
  requireApprovedRecruiter,
  updateInterviewValidator,
  validateRequest,
  updateInterviewController,
);

router.patch(
  "/:id/complete",
  interviewWriteLimiter,
  authorizeRoles("RECRUITER"),
  requireApprovedRecruiter,
  completeInterviewController,
);

// ─────────────────────────────────────────────
// CANDIDATE
// ─────────────────────────────────────────────

router.patch(
  "/:id/respond",
  interviewWriteLimiter,
  authorizeRoles("JOB_SEEKER"),
  validateRequest,
  updateInterviewByCandidateController,
);

// ─────────────────────────────────────────────
// CANCEL
// ─────────────────────────────────────────────

router.patch(
  "/:id/cancel",
  interviewWriteLimiter,
  authorizeRoles("JOB_SEEKER", "RECRUITER"),
  cancelInterviewController,
);

export default router;