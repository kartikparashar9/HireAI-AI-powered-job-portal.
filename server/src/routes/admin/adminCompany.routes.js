import { Router } from "express";

import authMiddleware from "../../middlewares/auth.middleware.js";
import authorizeRoles from "../../middlewares/role.middleware.js";

import {
  getAllCompaniesController,
  getCompanyByIdController,
  deleteCompanyController,
} from "../../controllers/admin/company.controller.js";

const router = Router();

router.use(authMiddleware);
router.use(authorizeRoles("ADMIN"));

router.get("/", getAllCompaniesController);
router.get("/:id", getCompanyByIdController);
router.delete("/:id", deleteCompanyController);

export default router;
