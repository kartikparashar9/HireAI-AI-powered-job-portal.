import { Router } from "express";

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
} from "../controllers/interview.controller.js";

import {
  interviewReadLimiter,
  interviewWriteLimiter,
} from "../middlewares/rateLimiter.middleware.js";

const router = Router();

router.use(authMiddleware);

// =====================================================
// COMMON
// =====================================================

router.get(
  "/my",
  interviewReadLimiter,
  authorizeRoles("JOB_SEEKER", "RECRUITER"),
  getMyInterviewsController,
);

// =====================================================
// RECRUITER
// =====================================================

// Schedule interview
router.post(
  "/",
  interviewWriteLimiter,
  authorizeRoles("RECRUITER"),
  requireApprovedRecruiter,
  createInterviewValidator,
  validateRequest,
  createInterviewController,
);

// Update scheduled interview
router.patch(
  "/:id",
  interviewWriteLimiter,
  authorizeRoles("RECRUITER"),
  requireApprovedRecruiter,
  updateInterviewValidator,
  validateRequest,
  updateInterviewController,
);

// =====================================================
// CANDIDATE
// =====================================================

// Candidate accepts/rejects interview
router.patch(
  "/:id/respond",
  interviewWriteLimiter,
  authorizeRoles("JOB_SEEKER"),
  validateRequest,
  updateInterviewByCandidateController,
);

// =====================================================
// CANCEL
// =====================================================

// Recruiter or candidate can cancel
router.patch(
  "/:id/cancel",
  interviewWriteLimiter,
  authorizeRoles("JOB_SEEKER", "RECRUITER"),
  cancelInterviewController,
);

// =====================================================
// COMMON - SINGLE INTERVIEW
// =====================================================

router.get(
  "/:id",
  interviewReadLimiter,
  authorizeRoles("JOB_SEEKER", "RECRUITER"),
  getInterviewByIdController,
);

export default router;
