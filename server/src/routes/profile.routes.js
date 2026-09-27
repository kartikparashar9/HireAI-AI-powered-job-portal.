import { Router } from "express";

import authMiddleware from "../middlewares/auth.middleware.js";
import validateRequest from "../middlewares/validate.middleware.js";

import { profileValidator } from "../validators/profile.validator.js";

import {
  createMyProfile,
  getMyProfile,
  updateMyProfile,
  deleteMyProfile,
} from "../controllers/profile.controller.js";

import {
    profileReadLimiter,
    profileWriteLimiter
} from "../middlewares/rateLimiter.middleware.js";

const router = Router();

router.use(authMiddleware);

router.get(
  "/me",
  profileReadLimiter,
  getMyProfile
);

router.post(
  "/",
  profileWriteLimiter,
  profileValidator,
  validateRequest,
  createMyProfile
);

router.patch(
  "/me",
  profileWriteLimiter,
  profileValidator,
  validateRequest,
  updateMyProfile
);

router.delete(
  "/me",
  profileWriteLimiter,
  deleteMyProfile
);

export default router;