import { Router } from "express";

import authMiddleware from "../middlewares/auth.middleware.js";
import authorizeRoles from "../middlewares/role.middleware.js";
import requireApprovedRecruiter from "../middlewares/recruiter.middleware.js";
import validateRequest from "../middlewares/validate.middleware.js";

import {
  createApplicationValidator,
  updateApplicationStatusValidator,
} from "../validators/application.validator.js";

import {
  applyToJobController,
  getMyApplicationsController,
  getApplicationByIdController,
  withdrawApplicationController,
  getJobApplicationsController,
  updateApplicationStatusController,
  getShortlistedApplicationsController,
} from "../controllers/application.controller.js";

import {
  applicationReadLimiter,
  applicationWriteLimiter,
} from "../middlewares/rateLimiter.middleware.js";

const router = Router();

router.use(authMiddleware);

// =====================================================
// JOB SEEKER
// =====================================================

router.post(
  "/jobs/:jobId/apply",
  applicationWriteLimiter,
  authorizeRoles("JOB_SEEKER"),
  createApplicationValidator,
  validateRequest,
  applyToJobController,
);

router.get(
  "/my",
  applicationReadLimiter,
  authorizeRoles("JOB_SEEKER"),
  getMyApplicationsController,
);

router.patch(
  "/:id/withdraw",
  applicationWriteLimiter,
  authorizeRoles("JOB_SEEKER"),
  withdrawApplicationController,
);

// =====================================================
// RECRUITER
// =====================================================

// IMPORTANT:
// Must come before "/:id"
router.get(
  "/shortlisted",
  applicationReadLimiter,
  authorizeRoles("RECRUITER"),
  requireApprovedRecruiter,
  getShortlistedApplicationsController,
);

router.get(
  "/jobs/:jobId",
  applicationReadLimiter,
  authorizeRoles("RECRUITER"),
  requireApprovedRecruiter,
  getJobApplicationsController,
);

router.patch(
  "/:id/status",
  applicationWriteLimiter,
  authorizeRoles("RECRUITER"),
  requireApprovedRecruiter,
  updateApplicationStatusValidator,
  validateRequest,
  updateApplicationStatusController,
);

// =====================================================
// SINGLE APPLICATION
// =====================================================

router.get(
  "/:id",
  applicationReadLimiter,
  authorizeRoles("JOB_SEEKER"),
  getApplicationByIdController,
);

export default router;
