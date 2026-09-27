import mongoose from "mongoose";

const experienceSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
      maxlength: [150, "Company name cannot exceed 150 characters"],
    },
    position: {
      type: String,
      required: [true, "Position is required"],
      trim: true,
      maxlength: [150, "Position cannot exceed 150 characters"],
    },
    location: {
      type: String,
      trim: true,
      maxlength: [150, "Location cannot exceed 150 characters"],
    },
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
    },
    endDate: {
      type: Date,
      default: null,
    },
    isCurrent: {
      type: Boolean,
      default: false,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },
  },
  { _id: true },
);

const educationSchema = new mongoose.Schema(
  {
    institution: {
      type: String,
      required: [true, "Institution is required"],
      trim: true,
      maxlength: [200, "Institution cannot exceed 200 characters"],
    },
    degree: {
      type: String,
      required: [true, "Degree is required"],
      trim: true,
      maxlength: [150, "Degree cannot exceed 150 characters"],
    },
    field: {
      type: String,
      trim: true,
      maxlength: [150, "Field cannot exceed 150 characters"],
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    grade: {
      type: String,
      trim: true,
      maxlength: [50, "Grade cannot exceed 50 characters"],
    },
  },
  { _id: true },
);

const socialLinksSchema = new mongoose.Schema(
  {
    linkedin: {
      type: String,
      trim: true,
      maxlength: [300, "LinkedIn URL cannot exceed 300 characters"],
    },
    github: {
      type: String,
      trim: true,
      maxlength: [300, "GitHub URL cannot exceed 300 characters"],
    },
    portfolio: {
      type: String,
      trim: true,
      maxlength: [300, "Portfolio URL cannot exceed 300 characters"],
    },
  },
  { _id: false },
);

const profileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
      unique: true,
      index: true,
    },

    phone: {
      type: String,
      trim: true,
      maxlength: [20, "Phone number cannot exceed 20 characters"],
    },

    headline: {
      type: String,
      trim: true,
      maxlength: [150, "Headline cannot exceed 150 characters"],
    },

    about: {
      type: String,
      trim: true,
      maxlength: [3000, "About section cannot exceed 3000 characters"],
    },

    location: {
      type: String,
      trim: true,
      maxlength: [150, "Location cannot exceed 150 characters"],
    },

    skills: [
      {
        type: String,
        trim: true,
        maxlength: [50, "Skill cannot exceed 50 characters"],
      },
    ],

    experience: {
      type: [experienceSchema],
      default: [],
    },

    education: {
      type: [educationSchema],
      default: [],
    },

    socialLinks: {
      type: socialLinksSchema,
      default: () => ({}),
    },

    profileCompletion: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
  },
  {
    timestamps: true,
  },
);

const Profile = mongoose.model("Profile", profileSchema);

export default Profile;
