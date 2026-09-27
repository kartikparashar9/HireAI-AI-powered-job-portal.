import { Router } from "express";

import authMiddleware from "../../middlewares/auth.middleware.js";
import authorizeRoles from "../../middlewares/role.middleware.js";

import {
  getAllRecruitersController,
  getPendingRecruitersController,
  approveRecruiterController,
  rejectRecruiterController,
} from "../../controllers/admin/recruiter.controller.js";

const router = Router();

router.use(authMiddleware);

router.get("/", getAllRecruitersController);
router.use(authorizeRoles("ADMIN"));
router.get("/pending", getPendingRecruitersController);
router.patch("/:id/approve", approveRecruiterController);
router.patch("/:id/reject", rejectRecruiterController);

export default router;
