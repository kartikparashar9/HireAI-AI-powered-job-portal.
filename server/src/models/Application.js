import mongoose from "mongoose";

import {
  APPLICATION_STATUS_VALUES,
  APPLICATION_STATUSES,
} from "../constants/applicationStatus.js";

const applicationSchema = new mongoose.Schema(
  {
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

    resume: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resume",
      default: null,
    },

    coverLetter: {
      type: String,
      trim: true,
      maxlength: [5000, "Cover letter cannot exceed 5000 characters"],
      default: "",
    },

    status: {
      type: String,
      enum: {
        values: APPLICATION_STATUS_VALUES,
        message: "Invalid application status",
      },
      default: APPLICATION_STATUSES.APPLIED,
      index: true,
    },

    recruiterNote: {
      type: String,
      trim: true,
      maxlength: [3000, "Recruiter note cannot exceed 3000 characters"],
      default: "",
    },

    appliedAt: {
      type: Date,
      default: Date.now,
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

// A candidate can apply to a particular job only once.
applicationSchema.index({ job: 1, candidate: 1 }, { unique: true });

// Useful for recruiter applicant management.
applicationSchema.index({
  job: 1,
  status: 1,
  createdAt: -1,
});

// Useful for a candidate's application history.
applicationSchema.index({
  candidate: 1,
  createdAt: -1,
});

const Application = mongoose.model("Application", applicationSchema);

export default Application;
