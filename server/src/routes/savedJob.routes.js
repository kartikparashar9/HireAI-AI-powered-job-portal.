import { Router } from "express";
import rateLimit from "express-rate-limit";

import authMiddleware from "../middlewares/auth.middleware.js";
import authorizeRoles from "../middlewares/role.middleware.js";

import {
  saveJobController,
  getSavedJobsController,
  removeSavedJobController,
  checkSavedJobController,
} from "../controllers/savedJob.controller.js";

import {
    savedJobReadLimiter,
    savedJobWriteLimiter
} from "../middlewares/rateLimiter.middleware.js";

const router = Router();

router.use(authMiddleware);
router.use(authorizeRoles("JOB_SEEKER"));

router.get("/", savedJobReadLimiter, getSavedJobsController);
router.get("/:jobId/check", savedJobReadLimiter, checkSavedJobController);
router.post("/:jobId", savedJobWriteLimiter, saveJobController);
router.delete("/:jobId", savedJobWriteLimiter, removeSavedJobController);

export default router;