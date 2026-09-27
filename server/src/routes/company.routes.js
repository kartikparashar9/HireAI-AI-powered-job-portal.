import { Router } from "express";
import rateLimit from "express-rate-limit";

import authMiddleware from "../middlewares/auth.middleware.js";
import authorizeRoles from "../middlewares/role.middleware.js";
import requireApprovedRecruiter from "../middlewares/recruiter.middleware.js";
import validateRequest from "../middlewares/validate.middleware.js";

import {
  createCompanyValidator,
  updateCompanyValidator,
} from "../validators/company.validator.js";

import {
  createCompanyController,
  getMyCompanyController,
  getCompanyByIdController,
  updateCompanyController,
  deleteCompanyController,
} from "../controllers/company.controller.js";

import {
  companyReadLimiter,
  companyWriteLimiter
} from "../middlewares/rateLimiter.middleware.js";

const router = Router();

router.use(authMiddleware);

router.get(
  "/my",
  companyReadLimiter,
  authorizeRoles("RECRUITER"),
  requireApprovedRecruiter,
  getMyCompanyController,
);

router.get("/:id", companyReadLimiter, getCompanyByIdController);

router.post(
  "/",
  companyWriteLimiter,
  authorizeRoles("RECRUITER"),
  requireApprovedRecruiter,
  createCompanyValidator,
  validateRequest,
  createCompanyController,
);

router.patch(
  "/:id",
  companyWriteLimiter,
  authorizeRoles("RECRUITER"),
  requireApprovedRecruiter,
  updateCompanyValidator,
  validateRequest,
  updateCompanyController,
);

router.delete(
  "/:id",
  companyWriteLimiter,
  authorizeRoles("RECRUITER"),
  requireApprovedRecruiter,
  deleteCompanyController,
);

export default router;
