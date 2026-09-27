import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
      index: true,
    },

    type: {
      type: String,
      required: [true, "Notification type is required"],
      enum: {
        values: [
          "APPLICATION_STATUS",
          "INTERVIEW_SCHEDULED",
          "INTERVIEW_UPDATED",
          "INTERVIEW_CANCELLED",
          "JOB_RECOMMENDATION",
          "RESUME_ANALYSIS",
          "SYSTEM",
        ],
        message: "Invalid notification type",
      },
      index: true,
    },

    title: {
      type: String,
      required: [true, "Notification title is required"],
      trim: true,
      maxlength: 150,
    },

    message: {
      type: String,
      required: [true, "Notification message is required"],
      trim: true,
      maxlength: 500,
    },

    relatedId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },

    relatedType: {
      type: String,
      enum: [
        "APPLICATION",
        "INTERVIEW",
        "JOB",
        "RESUME",
        null,
      ],
      default: null,
    },

    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },

    readAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

notificationSchema.index({
  user: 1,
  isRead: 1,
  createdAt: -1,
});

notificationSchema.index({
  user: 1,
  createdAt: -1,
});

const Notification = mongoose.model(
  "Notification",
  notificationSchema,
);

export default Notification;