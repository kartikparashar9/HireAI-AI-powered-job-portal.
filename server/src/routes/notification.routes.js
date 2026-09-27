import express from "express";

import {
  getMyNotificationsController,
  getUnreadNotificationCountController,
  markNotificationAsReadController,
  markAllNotificationsAsReadController,
  deleteNotificationController,
} from "../controllers/notification.controller.js";

import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(authMiddleware);
router.get("/", getMyNotificationsController);
router.get("/unread-count", getUnreadNotificationCountController);
router.patch("/read-all", markAllNotificationsAsReadController);
router.patch("/:id/read", markNotificationAsReadController);
router.delete("/:id", deleteNotificationController);


export default router;