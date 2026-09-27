import { Router } from "express";
import rateLimit from "express-rate-limit";

import authMiddleware from "../middlewares/auth.middleware.js";
import uploadResume from "../middlewares/upload.middleware.js";
import validateRequest from "../middlewares/validate.middleware.js";

import { createResumeValidator } from "../validators/resume.validator.js";

import {
  uploadMyResume,
  getMyResumesController,
  getMyResumeById,
  makeResumePrimary,
  removeMyResume,
} from "../controllers/resume.controller.js";

import {
    resumeReadLimiter,
    resumeWriteLimiter
} from "../middlewares/rateLimiter.middleware.js"

const router = Router();

router.use(authMiddleware);

router.get("/", resumeReadLimiter, getMyResumesController);

router.get("/:id", resumeReadLimiter, getMyResumeById);

router.post(
  "/",
  resumeWriteLimiter,
  uploadResume,
  createResumeValidator,
  validateRequest,
  uploadMyResume,
);

router.patch("/:id/primary", resumeWriteLimiter, makeResumePrimary);

router.delete("/:id", resumeWriteLimiter, removeMyResume);

export default router;
