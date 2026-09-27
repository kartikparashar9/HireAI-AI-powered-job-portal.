import mongoose from "mongoose";

import { JOB_STATUS_VALUES, JOB_STATUSES } from "../constants/jobStatus.js";

import { JOB_TYPE_VALUES } from "../constants/jobType.js";

import { WORK_MODE_VALUES } from "../constants/workMode.js";

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Job title is required"],
      trim: true,
      minlength: [2, "Job title must be at least 2 characters"],
      maxlength: [150, "Job title cannot exceed 150 characters"],
    },

    description: {
      type: String,
      required: [true, "Job description is required"],
      trim: true,
      minlength: [20, "Job description must be at least 20 characters"],
      maxlength: [10000, "Job description cannot exceed 10000 characters"],
    },

    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: [true, "Company is required"],
      index: true,
    },

    recruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Recruiter is required"],
      index: true,
    },

    skills: {
      type: [String],
      required: [true, "At least one skill is required"],
      validate: {
        validator: (skills) => skills.length > 0,
        message: "At least one skill is required",
      },
    },

    location: {
      type: String,
      trim: true,
      maxlength: [200, "Location cannot exceed 200 characters"],
      default: "",
    },

    jobType: {
      type: String,
      required: [true, "Job type is required"],
      enum: {
        values: JOB_TYPE_VALUES,
        message: "Invalid job type",
      },
    },

    workMode: {
      type: String,
      required: [true, "Work mode is required"],
      enum: {
        values: WORK_MODE_VALUES,
        message: "Invalid work mode",
      },
    },

    experienceMin: {
      type: Number,
      min: [0, "Minimum experience cannot be negative"],
      default: 0,
    },

    experienceMax: {
      type: Number,
      min: [0, "Maximum experience cannot be negative"],
      default: 0,
    },

    salaryMin: {
      type: Number,
      min: [0, "Minimum salary cannot be negative"],
      default: 0,
    },

    salaryMax: {
      type: Number,
      min: [0, "Maximum salary cannot be negative"],
      default: 0,
    },

    status: {
      type: String,
      enum: {
        values: JOB_STATUS_VALUES,
        message: "Invalid job status",
      },
      default: JOB_STATUSES.OPEN,
      index: true,
    },

    applicationDeadline: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

jobSchema.index({ title: "text", description: "text", skills: "text" });
jobSchema.index({ status: 1, createdAt: -1 });
jobSchema.index({ recruiter: 1, createdAt: -1 });
jobSchema.index({ company: 1, createdAt: -1 });

const Job = mongoose.model("Job", jobSchema);

export default Job;