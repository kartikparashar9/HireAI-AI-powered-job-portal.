import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
      index: true,
    },

    title: {
      type: String,
      required: [true, "Resume title is required"],
      trim: true,
      maxlength: [150, "Resume title cannot exceed 150 characters"],
    },

    fileUrl: {
      type: String,
      required: [true, "Resume file URL is required"],
      trim: true,
    },

    publicId: {
      type: String,
      required: [true, "Resume public ID is required"],
      trim: true,
    },

    fileName: {
      type: String,
      required: [true, "Resume file name is required"],
      trim: true,
      maxlength: [255, "Resume file name cannot exceed 255 characters"],
    },

    fileType: {
      type: String,
      required: [true, "Resume file type is required"],
      enum: {
        values: [
          "application/pdf",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ],
        message: "Only PDF and DOCX resumes are supported",
      },
    },

    fileSize: {
      type: Number,
      required: [true, "Resume file size is required"],
      min: [1, "Resume file cannot be empty"],
    },

    isPrimary: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

const Resume = mongoose.model("Resume", resumeSchema);

export default Resume;
