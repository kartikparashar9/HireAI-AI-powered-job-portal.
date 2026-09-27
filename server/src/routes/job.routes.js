import { Router } from "express";
import rateLimit from "express-rate-limit";

import authMiddleware from "../middlewares/auth.middleware.js";
import authorizeRoles from "../middlewares/role.middleware.js";
import requireApprovedRecruiter from "../middlewares/recruiter.middleware.js";
import validateRequest from "../middlewares/validate.middleware.js";

import {
  createJobValidator,
  updateJobValidator,
} from "../validators/job.validator.js";

import {
  createJobController,
  getMyJobsController,
  getJobByIdController,
  updateJobController,
  deleteJobController,
  searchJobsController,
  getFeaturedJobsController,
} from "../controllers/job.controller.js";

import {
  jobReadLimiter,
  jobWriteLimiter
} from "../middlewares/rateLimiter.middleware.js";

const router = Router();

// Public job search
router.get("/", jobReadLimiter, searchJobsController);

// Public featured jobs
router.get("/featured", jobReadLimiter, getFeaturedJobsController);

// Recruiter's own jobs
router.get(
  "/my",
  jobReadLimiter,
  authMiddleware,
  authorizeRoles("RECRUITER"),
  requireApprovedRecruiter,
  getMyJobsController,
);

// Public job details
router.get("/:id", jobReadLimiter, getJobByIdController);

// Create job
router.post(
  "/",
  jobWriteLimiter,
  authMiddleware,
  authorizeRoles("RECRUITER"),
  requireApprovedRecruiter,
  createJobValidator,
  validateRequest,
  createJobController,
);

// Update job
router.patch(
  "/:id",
  jobWriteLimiter,
  authMiddleware,
  authorizeRoles("RECRUITER"),
  requireApprovedRecruiter,
  updateJobValidator,
  validateRequest,
  updateJobController,
);

// Delete job
router.delete(
  "/:id",
  jobWriteLimiter,
  authMiddleware,
  authorizeRoles("RECRUITER"),
  requireApprovedRecruiter,
  deleteJobController,
);

export default router;