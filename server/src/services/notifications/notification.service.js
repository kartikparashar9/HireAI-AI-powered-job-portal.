import Notification from "../../models/Notification.js";
import ApiError from "../../utils/ApiError.js";

const createNotification = async ({
  userId,
  type,
  title,
  message,
  relatedId = null,
  relatedType = null,
}) => {
  if (!userId) {
    throw new ApiError(400, "User ID is required");
  }

  const notification = await Notification.create({
    user: userId,
    type,
    title,
    message,
    relatedId,
    relatedType,
  });

  return notification;
};

const getMyNotifications = async ({
  userId,
  page = 1,
  limit = 20,
  unreadOnly = false,
}) => {
  const safePage = Math.max(Number(page) || 1, 1);

  const safeLimit = Math.min(Math.max(Number(limit) || 20, 1), 50);

  const skip = (safePage - 1) * safeLimit;

  const filter = {
    user: userId,
  };

  if (unreadOnly === true) {
    filter.isRead = false;
  }

  const [notifications, total] = await Promise.all([
    Notification.find(filter)
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(safeLimit)
      .lean(),

    Notification.countDocuments(filter),
  ]);

  return {
    notifications,
    pagination: {
      page: safePage,
      limit: safeLimit,
      total,
      totalPages: Math.ceil(total / safeLimit),
    },
  };
};

const getUnreadNotificationCount = async (userId) => {
  return Notification.countDocuments({
    user: userId,
    isRead: false,
  });
};

const markNotificationAsRead = async ({ userId, notificationId }) => {
  const notification = await Notification.findOne({
    _id: notificationId,
    user: userId,
  });

  if (!notification) {
    throw new ApiError(404, "Notification not found");
  }

  if (!notification.isRead) {
    notification.isRead = true;
    notification.readAt = new Date();

    await notification.save();
  }

  return notification;
};

const markAllNotificationsAsRead = async (userId) => {
  await Notification.updateMany(
    {
      user: userId,
      isRead: false,
    },
    {
      $set: {
        isRead: true,
        readAt: new Date(),
      },
    },
  );

  return true;
};

const deleteNotification = async ({ userId, notificationId }) => {
  const notification = await Notification.findOneAndDelete({
    _id: notificationId,
    user: userId,
  });

  if (!notification) {
    throw new ApiError(404, "Notification not found");
  }

  return notification;
};

export {
  createNotification,
  getMyNotifications,
  getUnreadNotificationCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
};