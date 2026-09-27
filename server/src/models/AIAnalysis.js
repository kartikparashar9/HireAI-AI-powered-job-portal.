import mongoose from "mongoose";

const aiAnalysisSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
      index: true,
    },

    resume: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resume",
      default: null,
      index: true,
    },

    analysisType: {
      type: String,
      required: [true, "Analysis type is required"],
      enum: {
        values: [
          "RESUME_ANALYSIS",
          "JOB_MATCHING",
          "SKILL_GAP",
          "INTERVIEW_PREPARATION",
          "JOB_RECOMMENDATION",
        ],
        message: "Invalid AI analysis type",
      },
      index: true,
    },

    result: {
      type: mongoose.Schema.Types.Mixed,
      required: [true, "Analysis result is required"],
    },

    model: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

aiAnalysisSchema.index({
  user: 1,
  analysisType: 1,
  createdAt: -1,
});

aiAnalysisSchema.index({
  resume: 1,
  analysisType: 1,
  createdAt: -1,
});

const AIAnalysis = mongoose.model("AIAnalysis", aiAnalysisSchema);

export default AIAnalysis;