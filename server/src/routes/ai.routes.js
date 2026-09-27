import express from "express";

import {
  analyzeResumeController,
  matchJobController,
  getJobRecommendationsController,
  analyzeSkillGapController,
  generateInterviewPreparationController,
  getMyAIAnalysesController,
  getAIAnalysisByIdController,
} from "../controllers/ai.controller.js";

import authMiddleware from "../middlewares/auth.middleware.js";
import authorizeRoles from "../middlewares/role.middleware.js";

import { aiRateLimiter } from "../middlewares/rateLimiter.middleware.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Authentication
|--------------------------------------------------------------------------
*/

router.use(authMiddleware);

/*
|--------------------------------------------------------------------------
| Role Authorization
|--------------------------------------------------------------------------
*/

router.use(authorizeRoles("JOB_SEEKER"));

/*
|--------------------------------------------------------------------------
| AI Rate Limiting
|--------------------------------------------------------------------------
*/

router.use(aiRateLimiter);

/*
|--------------------------------------------------------------------------
| AI Operations
|--------------------------------------------------------------------------
*/

router.post("/resume-analysis", analyzeResumeController);
router.post("/job-matching", matchJobController);
router.post("/recommendations", getJobRecommendationsController);
router.post("/skill-gap", analyzeSkillGapController);
router.post("/interview-preparation", generateInterviewPreparationController);

/*
|--------------------------------------------------------------------------
| AI Analysis History
|--------------------------------------------------------------------------
*/

router.get("/analyses", getMyAIAnalysesController);
router.get("/analyses/:id", getAIAnalysisByIdController);

export default router;