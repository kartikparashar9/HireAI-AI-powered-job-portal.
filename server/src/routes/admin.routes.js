import { Router } from "express";

import authMiddleware from "../middlewares/auth.middleware.js";
import authorizeRoles from "../middlewares/role.middleware.js";

import recruiterAdminRoutes from "./admin/adminRecruiter.routes.js";
import companyAdminRoutes from "./admin/adminCompany.routes.js";
import userAdminRoutes from "./admin/adminUser.routes.js";

const router = Router();

router.use(authMiddleware);
router.use(authorizeRoles("ADMIN"));

router.use("/users",userAdminRoutes);
router.use("/recruiters", recruiterAdminRoutes);
router.use("/companies", companyAdminRoutes);

export default router;