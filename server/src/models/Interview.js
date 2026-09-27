import mongoose from "mongoose";

import {
  INTERVIEW_STATUS_VALUES,
  INTERVIEW_STATUSES,
} from "../constants/interviewStatus.js";

import {
  INTERVIEW_TYPE_VALUES,
} from "../constants/interviewType.js";

const interviewSchema = new mongoose.Schema(
  {
    application: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
      required: [true, "Application is required"],
      unique: true,
      index: true,
    },

    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: [true, "Job is required"],
      index: true,
    },

    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Candidate is required"],
      index: true,
    },

    recruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Recruiter is required"],
      index: true,
    },

    type: {
      type: String,
      required: [true, "Interview type is required"],
      enum: {
        values: INTERVIEW_TYPE_VALUES,
        message: "Invalid interview type",
      },
    },

    scheduledAt: {
      type: Date,
      required: [true, "Interview date and time are required"],
    },

    durationMinutes: {
      type: Number,
      required: [true, "Interview duration is required"],
      min: [15, "Interview duration must be at least 15 minutes"],
      max: [180, "Interview duration cannot exceed 180 minutes"],
      default: 30,
    },

    meetingLink: {
      type: String,
      trim: true,
      default: "",
    },

    location: {
      type: String,
      trim: true,
      maxlength: [
        300,
        "Interview location cannot exceed 300 characters",
      ],
      default: "",
    },

    notes: {
      type: String,
      trim: true,
      maxlength: [
        3000,
        "Interview notes cannot exceed 3000 characters",
      ],
      default: "",
    },

    status: {
      type: String,
      enum: {
        values: INTERVIEW_STATUS_VALUES,
        message: "Invalid interview status",
      },
      default: INTERVIEW_STATUSES.SCHEDULED,
      index: true,
    },

    statusUpdatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

interviewSchema.index({
  candidate: 1,
  scheduledAt: 1,
});

interviewSchema.index({
  recruiter: 1,
  scheduledAt: 1,
});

const Interview = mongoose.model(
  "Interview",
  interviewSchema,
);

export default Interview;