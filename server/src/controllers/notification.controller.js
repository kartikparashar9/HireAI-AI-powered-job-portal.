import {
  getMyNotifications,
  getUnreadNotificationCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from "../services/notifications/notification.service.js";

import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const getMyNotificationsController = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, unreadOnly = "false" } = req.query;

  const result = await getMyNotifications({
    userId: req.user._id,
    page,
    limit,
    unreadOnly: unreadOnly === "true",
  });

  return res
    .status(200)
    .json(new ApiResponse(200, result, "Notifications fetched successfully"));
});

const getUnreadNotificationCountController = asyncHandler(async (req, res) => {
  const count = await getUnreadNotificationCount(req.user._id);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { count },
        "Unread notification count fetched successfully",
      ),
    );
});

const markNotificationAsReadController = asyncHandler(async (req, res) => {
  const notification = await markNotificationAsRead({
    userId: req.user._id,
    notificationId: req.params.id,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, notification, "Notification marked as read"));
});

const markAllNotificationsAsReadController = asyncHandler(async (req, res) => {
  await markAllNotificationsAsRead(req.user._id);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "All notifications marked as read"));
});

const deleteNotificationController = asyncHandler(async (req, res) => {
  await deleteNotification({
    userId: req.user._id,
    notificationId: req.params.id,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Notification deleted successfully"));
});

export {
  getMyNotificationsController,
  getUnreadNotificationCountController,
  markNotificationAsReadController,
  markAllNotificationsAsReadController,
  deleteNotificationController,
};