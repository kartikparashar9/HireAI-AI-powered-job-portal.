import mongoose from "mongoose";

import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";

import AIAnalysis from "../models/AIAnalysis.js";
import Resume from "../models/Resume.js";
import Job from "../models/Job.js";

import { AI_MODEL } from "../config/ai.js";

import { analyzeResume } from "../services/ai/resumeAnalysis.service.js";
import { matchResumeWithJob } from "../services/ai/jobMatching.service.js";
import { getJobRecommendations } from "../services/ai/recommendation.service.js";
import { analyzeSkillGap } from "../services/ai/skillGap.service.js";
import { generateInterviewPreparation } from "../services/ai/interviewPrep.service.js";

import { extractResumeText } from "../services/resume/resumeParser.service.js";

/**
 * Get resume owned by logged-in user
 * and extract its text from Cloudinary.
 */
const getResumeTextForUser = async (userId, resumeId) => {
  if (!resumeId) {
    throw new ApiError(400, "Resume ID is required");
  }

  if (!mongoose.isValidObjectId(resumeId)) {
    throw new ApiError(400, "Invalid Resume ID");
  }

  const resume = await Resume.findById(resumeId);

  if (!resume) {
    throw new ApiError(404, "Resume not found");
  }

  // Make sure the resume belongs to the logged-in user.
  if (resume.user.toString() !== userId.toString()) {
    throw new ApiError(403, "You do not have access to this resume");
  }

  const resumeText = await extractResumeText(resume);

  if (!resumeText?.trim()) {
    throw new ApiError(400, "Could not extract readable text from the resume");
  }

  return {
    resume,
    resumeText,
  };
};

/**
 * Validate MongoDB ObjectId.
 */
const validateObjectId = (id, fieldName) => {
  if (!id) {
    throw new ApiError(400, `${fieldName} is required`);
  }

  if (!mongoose.isValidObjectId(id)) {
    throw new ApiError(400, `Invalid ${fieldName}`);
  }
};

/**
 * POST /api/ai/resume-analysis
 *
 * Body:
 * {
 *   "resumeId": "..."
 * }
 */
const analyzeResumeController = asyncHandler(async (req, res) => {
  const { resumeId } = req.body;

  const { resume, resumeText } = await getResumeTextForUser(
    req.user.userId,
    resumeId,
  );

  const result = await analyzeResume(resumeText);

  const analysis = await AIAnalysis.create({
    user: req.user.userId,
    resume: resume._id,
    analysisType: "RESUME_ANALYSIS",
    result,
    model: AI_MODEL,
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        analysisId: analysis._id,
        resumeId: resume._id,
        result,
      },
      "Resume analysis completed successfully",
    ),
  );
});

/**
 * POST /api/ai/job-matching
 *
 * Body:
 * {
 *   "resumeId": "...",
 *   "jobId": "..."
 * }
 */
const matchJobController = asyncHandler(async (req, res) => {
  const { resumeId, jobId } = req.body;

  validateObjectId(jobId, "Job ID");

  const job = await Job.findById(jobId).lean();

  if (!job) {
    throw new ApiError(404, "Job not found");
  }

  const { resume, resumeText } = await getResumeTextForUser(
    req.user.userId,
    resumeId,
  );

  const result = await matchResumeWithJob({
    resumeText,
    job,
  });

  const analysis = await AIAnalysis.create({
    user: req.user.userId,
    resume: resume._id,
    analysisType: "JOB_MATCHING",
    result,
    model: AI_MODEL,
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        analysisId: analysis._id,
        resumeId: resume._id,
        jobId: job._id,
        result,
      },
      "Job matching completed successfully",
    ),
  );
});

/**
 * POST /api/ai/recommendations
 *
 * Body:
 * {
 *   "resumeId": "...",
 *   "candidateProfile": {}
 * }
 */
const getJobRecommendationsController = asyncHandler(async (req, res) => {
  const { resumeId, candidateProfile = {} } = req.body;

  const { resume, resumeText } = await getResumeTextForUser(
    req.user.userId,
    resumeId,
  );

  const jobs = await Job.find({
    status: "OPEN",
  })
    .sort({ createdAt: -1 })
    .lean();

  const result = await getJobRecommendations({
    candidateProfile,
    resumeText,
    jobs,
  });

  const analysis = await AIAnalysis.create({
    user: req.user.userId,
    resume: resume._id,
    analysisType: "JOB_RECOMMENDATION",
    result,
    model: AI_MODEL,
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        analysisId: analysis._id,
        resumeId: resume._id,
        recommendations: result,
      },
      "Job recommendations generated successfully",
    ),
  );
});

/**
 * POST /api/ai/skill-gap
 *
 * Body:
 * {
 *   "resumeId": "...",
 *   "jobId": "..."
 * }
 */
const analyzeSkillGapController = asyncHandler(async (req, res) => {
  const { resumeId, jobId } = req.body;

  validateObjectId(jobId, "Job ID");

  const job = await Job.findById(jobId).lean();

  if (!job) {
    throw new ApiError(404, "Job not found");
  }

  const { resume, resumeText } = await getResumeTextForUser(
    req.user.userId,
    resumeId,
  );

  const result = await analyzeSkillGap({
    resumeText,
    job,
  });

  const analysis = await AIAnalysis.create({
    user: req.user.userId,
    resume: resume._id,
    analysisType: "SKILL_GAP",
    result,
    model: AI_MODEL,
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        analysisId: analysis._id,
        resumeId: resume._id,
        jobId: job._id,
        result,
      },
      "Skill gap analysis completed successfully",
    ),
  );
});

/**
 * POST /api/ai/interview-preparation
 *
 * Body:
 * {
 *   "resumeId": "...",
 *   "jobId": "...",
 *   "candidateProfile": {}
 * }
 */
const generateInterviewPreparationController = asyncHandler(
  async (req, res) => {
    const { resumeId, jobId, candidateProfile = {} } = req.body;

    validateObjectId(jobId, "Job ID");

    const job = await Job.findById(jobId).lean();

    if (!job) {
      throw new ApiError(404, "Job not found");
    }

    const { resume, resumeText } = await getResumeTextForUser(
      req.user.userId,
      resumeId,
    );

    const result = await generateInterviewPreparation({
      resumeText,
      candidateProfile,
      job,
    });

    const analysis = await AIAnalysis.create({
      user: req.user.userId,
      resume: resume._id,
      analysisType: "INTERVIEW_PREPARATION",
      result,
      model: AI_MODEL,
    });

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          analysisId: analysis._id,
          resumeId: resume._id,
          jobId: job._id,
          result,
        },
        "Interview preparation generated successfully",
      ),
    );
  },
);

/**
 * GET /api/ai/analyses
 *
 * Get logged-in user's AI analysis history.
 */
const getMyAIAnalysesController = asyncHandler(async (req, res) => {
  const analyses = await AIAnalysis.find({
    user: req.user.userId,
  })
    .populate("resume", "title fileName fileType isPrimary")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        analyses,
        "AI analysis history fetched successfully",
      ),
    );
});

/**
 * GET /api/ai/analyses/:id
 *
 * Get one analysis belonging to logged-in user.
 */
const getAIAnalysisByIdController = asyncHandler(async (req, res) => {
  const { id } = req.params;

  validateObjectId(id, "Analysis ID");

  const analysis = await AIAnalysis.findOne({
    _id: id,
    user: req.user.userId,
  }).populate("resume", "title fileName fileType fileUrl isPrimary");

  if (!analysis) {
    throw new ApiError(404, "AI analysis not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, analysis, "AI analysis fetched successfully"));
});

export {
  analyzeResumeController,
  matchJobController,
  getJobRecommendationsController,
  analyzeSkillGapController,
  generateInterviewPreparationController,
  getMyAIAnalysesController,
  getAIAnalysisByIdController,
};
