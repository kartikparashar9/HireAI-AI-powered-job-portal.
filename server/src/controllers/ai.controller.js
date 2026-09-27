import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";

import AIAnalysis from "../models/AIAnalysis.js";

import { AI_MODEL } from "../config/ai.js";

import { analyzeResume } from "../services/ai/resumeAnalysis.service.js";
import { matchResumeWithJob } from "../services/ai/jobMatching.service.js";
import { getJobRecommendations } from "../services/ai/recommendation.service.js";
import { analyzeSkillGap } from "../services/ai/skillGap.service.js";
import { generateInterviewPreparation } from "../services/ai/interviewPrep.service.js";

import Job from "../models/Job.js";

/*
|--------------------------------------------------------------------------
| Resume Analysis
|--------------------------------------------------------------------------
*/

const analyzeResumeController = asyncHandler(async (req, res) => {
  const { resumeText } = req.body;

  if (!resumeText?.trim()) {
    throw new ApiError(400, "Resume text is required");
  }

  const analysis = await analyzeResume(resumeText);

  const savedAnalysis = await AIAnalysis.create({
    user: req.user.userId,
    resume: null,
    analysisType: "RESUME_ANALYSIS",
    result: analysis,
    model: AI_MODEL,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, savedAnalysis, "Resume analyzed successfully"));
});

/*
|--------------------------------------------------------------------------
| Job Matching
|--------------------------------------------------------------------------
*/

const matchJobController = asyncHandler(async (req, res) => {
  const { resumeText, jobId } = req.body;

  if (!resumeText?.trim()) {
    throw new ApiError(400, "Resume text is required");
  }

  if (!jobId) {
    throw new ApiError(400, "Job ID is required");
  }

  const job = await Job.findById(jobId).lean();

  if (!job) {
    throw new ApiError(404, "Job not found");
  }

  const result = await matchResumeWithJob({
    resumeText,
    job,
  });

  const savedAnalysis = await AIAnalysis.create({
    user: req.user.userId,
    resume: null,
    analysisType: "JOB_MATCHING",
    result,
    model: AI_MODEL,
  });

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        savedAnalysis,
        "Job matching completed successfully",
      ),
    );
});

/*
|--------------------------------------------------------------------------
| Job Recommendations
|--------------------------------------------------------------------------
*/

const getJobRecommendationsController = asyncHandler(async (req, res) => {
  const { resumeText = "", candidateProfile = {} } = req.body;

  const hasProfile =
    candidateProfile && Object.keys(candidateProfile).length > 0;

  if (!resumeText?.trim() && !hasProfile) {
    throw new ApiError(400, "Candidate information is required");
  }

  /*
   * Only consider currently open jobs.
   * AI should choose from this controlled list.
   */

  const jobs = await Job.find({
    status: "OPEN",
  })
    .sort({
      createdAt: -1,
    })
    .limit(50)
    .lean();

  const result = await getJobRecommendations({
    candidateProfile,
    resumeText,
    jobs,
  });

  const savedAnalysis = await AIAnalysis.create({
    user: req.user.userId,
    resume: null,
    analysisType: "JOB_RECOMMENDATION",
    result,
    model: AI_MODEL,
  });

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        savedAnalysis,
        "Job recommendations generated successfully",
      ),
    );
});

/*
|--------------------------------------------------------------------------
| Skill Gap Analysis
|--------------------------------------------------------------------------
*/

const analyzeSkillGapController = asyncHandler(async (req, res) => {
  const { resumeText, jobId } = req.body;

  if (!resumeText?.trim()) {
    throw new ApiError(400, "Resume text is required");
  }

  if (!jobId) {
    throw new ApiError(400, "Job ID is required");
  }

  const job = await Job.findById(jobId).lean();

  if (!job) {
    throw new ApiError(404, "Job not found");
  }

  const result = await analyzeSkillGap({
    resumeText,
    job,
  });

  const savedAnalysis = await AIAnalysis.create({
    user: req.user.userId,
    resume: null,
    analysisType: "SKILL_GAP",
    result,
    model: AI_MODEL,
  });

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        savedAnalysis,
        "Skill gap analysis completed successfully",
      ),
    );
});

/*
|--------------------------------------------------------------------------
| Interview Preparation
|--------------------------------------------------------------------------
*/

const generateInterviewPreparationController = asyncHandler(
  async (req, res) => {
    const { resumeText = "", candidateProfile = {}, jobId } = req.body;

    if (!jobId) {
      throw new ApiError(400, "Job ID is required");
    }

    const job = await Job.findById(jobId).lean();

    if (!job) {
      throw new ApiError(404, "Job not found");
    }

    const hasProfile =
      candidateProfile && Object.keys(candidateProfile).length > 0;

    if (!resumeText?.trim() && !hasProfile) {
      throw new ApiError(400, "Candidate information is required");
    }

    const result = await generateInterviewPreparation({
      resumeText,
      candidateProfile,
      job,
    });

    const savedAnalysis = await AIAnalysis.create({
      user: req.user.userId,
      resume: null,
      analysisType: "INTERVIEW_PREPARATION",
      result,
      model: AI_MODEL,
    });

    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          savedAnalysis,
          "Interview preparation generated successfully",
        ),
      );
  },
);

/*
|--------------------------------------------------------------------------
| Get My AI Analyses
|--------------------------------------------------------------------------
*/

const getMyAIAnalysesController = asyncHandler(async (req, res) => {
  const analyses = await AIAnalysis.find({
    user: req.user.userId,
  })
    .sort({
      createdAt: -1,
    })
    .lean();

  return res
    .status(200)
    .json(new ApiResponse(200, analyses, "AI analyses fetched successfully"));
});

/*
|--------------------------------------------------------------------------
| Get AI Analysis By ID
|--------------------------------------------------------------------------
*/

const getAIAnalysisByIdController = asyncHandler(async (req, res) => {
  const analysis = await AIAnalysis.findOne({
    _id: req.params.id,
    user: req.user.userId,
  }).lean();

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