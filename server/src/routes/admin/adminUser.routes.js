import express from "express";

import {
  getAllUsersController,
  getUserByIdController,
  updateUserStatusController,
  deleteUserController,
} from "../../controllers/admin/adminUser.controller.js";

import authMiddleware from "../../middlewares/auth.middleware.js";
import authorizeRoles from "../../middlewares/role.middleware.js";

import validateRequest from "../../middlewares/validate.middleware.js";

import {
  adminUserIdValidator,
  updateUserStatusValidator,
} from "../../validators/adminUser.validator.js";

const router = express.Router();

router.use(authMiddleware);
router.use(authorizeRoles("ADMIN"));

// =========================
// USER MANAGEMENT
// =========================

router.get("/", getAllUsersController);

router.get(
  "/:id",
  adminUserIdValidator,
  validateRequest,
  getUserByIdController,
);

router.patch(
  "/:id/status",
  updateUserStatusValidator,
  validateRequest,
  updateUserStatusController,
);

router.delete(
  "/:id",
  adminUserIdValidator,
  validateRequest,
  deleteUserController,
);

export default router;
