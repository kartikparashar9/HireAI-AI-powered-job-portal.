import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import AIAnswerHeader from "../components/answer/AIAnswerHeader";
import AIAnalysisComplete from "../components/answer/AIAnalysisComplete";
import AIStatsCards from "../components/answer/AIStatsCards";

import ResumeSummary from "../components/answer/ResumeSummary";
import SkillsSection from "../components/answer/SkillsSection";
import StrengthsSection from "../components/answer/StrenghtsSection";
import ExperienceSection from "../components/answer/ExperienceSection";
import EducationSection from "../components/answer/EducationSection";
import MissingInformation from "../components/answer/MissingInformation";
import ImprovementSuggestions from "../components/answer/ImprovementSuggestions";

import JobMatchResult from "../components/JobMatchResult";
import RecommendationsResult from "../components/RecomandationsResult";
import SkillGapResult from "../components/SkillGapResult";
import InterviewPreparationResult from "../components/InterviewPreparationResult";

import AIEmptyState from "../components/common/AIEmptyState";
import AILoading from "../components/common/AILoading";

import {
  unwrapAIResult,
  getMatchScore,
  getScoreLabel,
  getAnalysisStats,
} from "../../../utils/aiAnswerUtils";

import "../ai.css";

/* =========================================================
   ANALYSIS TITLES
========================================================= */

const getAnalysisTypeTitle = (analysisType) => {
  const titles = {
    RESUME_ANALYSIS: "AI Resume Analysis",
    JOB_MATCHING: "AI Job Match",
    JOB_RECOMMENDATION: "AI Job Recommendations",
    SKILL_GAP: "AI Skill Gap Analysis",
    INTERVIEW_PREPARATION: "AI Interview Preparation",
  };

  return titles[analysisType] || "AI Career Analysis";
};

/* =========================================================
   RECOMMENDATION NORMALIZER
========================================================= */

const normalizeRecommendationResult = (result) => {
  if (Array.isArray(result)) {
    return result;
  }

  if (Array.isArray(result?.recommendations)) {
    return result.recommendations;
  }

  if (Array.isArray(result?.result)) {
    return result.result;
  }

  return result;
};

/* =========================================================
   AI ANSWER PAGE
========================================================= */

const AIAnswer = () => {
  const location = useLocation();
  const navigate = useNavigate();

  /* =======================================================
     REDUX AI STATE
  ======================================================= */

  const aiState = useSelector((state) => state.ai);

  const {
    /*
     * IMPORTANT:
     * These aliases prevent naming conflicts.
     */

    resumeAnalysis: reduxResumeAnalysis,
    jobMatching: reduxJobMatching,
    jobRecommendations: reduxJobRecommendations,
    skillGap: reduxSkillGap,
    interviewPreparation: reduxInterviewPreparation,

    /*
     * Loading states
     */

    isResumeAnalyzing,

    isJobMatching: isJobMatchingLoading,

    isRecommendationsLoading,

    isSkillGapAnalyzing,

    isInterviewPreparing,
  } = aiState;

  /* =======================================================
     NAVIGATION STATE
  ======================================================= */

  const navigationResult = location.state?.result;

  const navigationType = location.state?.analysisType;

  const navigationResumeTitle = location.state?.resumeTitle;

  const navigationJob = location.state?.job;

  /* =======================================================
     INITIAL VALUES
  ======================================================= */

  let analysisType = navigationType || null;

  let rawResult = navigationResult || null;

  let resumeTitle = navigationResumeTitle || null;

  let selectedJob = navigationJob || null;

  /* =======================================================
     REDUX FALLBACK
     
     If user refreshes the answer page,
     location.state disappears.

     So we use Redux result as fallback.
  ======================================================= */

  if (!rawResult) {
    /* Resume Analysis */

    if (reduxResumeAnalysis) {
      analysisType = "RESUME_ANALYSIS";

      rawResult = reduxResumeAnalysis;
    } else if (reduxJobMatching) {

    /* Job Matching */
      analysisType = "JOB_MATCHING";

      rawResult = reduxJobMatching;
    } else if (

    /* Job Recommendations */
      reduxJobRecommendations &&
      (Array.isArray(reduxJobRecommendations)
        ? reduxJobRecommendations.length > 0
        : true)
    ) {
      analysisType = "JOB_RECOMMENDATION";

      rawResult = reduxJobRecommendations;
    } else if (reduxSkillGap) {

    /* Skill Gap */
      analysisType = "SKILL_GAP";

      rawResult = reduxSkillGap;
    } else if (reduxInterviewPreparation) {

    /* Interview Preparation */
      analysisType = "INTERVIEW_PREPARATION";

      rawResult = reduxInterviewPreparation;
    }
  }

  /* =======================================================
     LOADING
  ======================================================= */

  const isLoading =
    isResumeAnalyzing ||
    isJobMatchingLoading ||
    isRecommendationsLoading ||
    isSkillGapAnalyzing ||
    isInterviewPreparing;

  /* =======================================================
     NORMALIZE AI RESULT
  ======================================================= */

  let result = unwrapAIResult(rawResult);

  /* =======================================================
     NORMALIZE RECOMMENDATIONS
  ======================================================= */

  if (analysisType === "JOB_RECOMMENDATION") {
    result = normalizeRecommendationResult(result);
  }

  /* =======================================================
     LOADING UI
  ======================================================= */

  if (isLoading) {
    return (
      <main className="ai-answer-page">
        <div className="ai-answer-container">
          <AILoading
            message={`Generating ${getAnalysisTypeTitle(analysisType)}...`}
          />
        </div>
      </main>
    );
  }

  /* =======================================================
     NO RESULT
  ======================================================= */

  if (!result || !analysisType) {
    return (
      <main className="ai-answer-page">
        <div className="ai-answer-container">
          <AIEmptyState
            title="No AI result available"
            message="Run an AI Career analysis first. Your detailed answer will appear here."
          />

          <div className="ai-empty-action">
            <button type="button" onClick={() => navigate("/jobseeker/ai")}>
              ← Back to AI Career
            </button>
          </div>
        </div>
      </main>
    );
  }

  /* =======================================================
     ANALYSIS TYPE FLAGS
     
     IMPORTANT:
     These are DIFFERENT from Redux variables.
     No duplicate declaration.
  ======================================================= */

  const isResumeAnalysis = analysisType === "RESUME_ANALYSIS";
  const isJobMatchingType = analysisType === "JOB_MATCHING";
  const isRecommendations = analysisType === "JOB_RECOMMENDATION";
  const isSkillGap = analysisType === "SKILL_GAP";
  const isInterviewPreparation = analysisType === "INTERVIEW_PREPARATION";

  /* =======================================================
     RESUME STATS
  ======================================================= */

  const resumeStats = isResumeAnalysis ? getAnalysisStats(result) : null;

  /* =======================================================
     SCORE
  ======================================================= */

  let score;

  /*
   * Resume Analysis score
   */

  if (isResumeAnalysis) {
    if (result?.score !== undefined && result?.score !== null) {
      score = Number(result.score);
    } else if (
      result?.overallScore !== undefined &&
      result?.overallScore !== null
    ) {
      score = Number(result.overallScore);
    }
  }

  /*
   * Job Matching score
   */

  if (isJobMatchingType) {
    score = getMatchScore(result);
  }

  /*
   * Invalid score
   */

  if (Number.isNaN(score) || score === undefined || score === null) {
    score = undefined;
  }

  const scoreLabel = score !== undefined ? getScoreLabel(score) : undefined;

  /* =======================================================
     PAGE
  ======================================================= */

  return (
    <main className="ai-answer-page">
      <div className="ai-answer-container">
        {/* =================================================
            HEADER
        ================================================= */}

        <AIAnswerHeader analysisType={analysisType} resumeTitle={resumeTitle} />

        {/* =================================================
            COMPLETION
        ================================================= */}

        <AIAnalysisComplete
          analysisType={analysisType}
          score={score}
          scoreLabel={scoreLabel}
        />

        {/* =================================================
            RESUME ANALYSIS
        ================================================= */}

        {isResumeAnalysis && (
          <>
            <AIStatsCards stats={resumeStats} />

            <div className="ai-answer-content-grid">
              <ResumeSummary summary={result?.summary} />

              <SkillsSection skills={result?.skills} />

              <StrengthsSection strengths={result?.strengths} />

              <ExperienceSection experience={result?.experience} />

              <EducationSection education={result?.education} />

              <MissingInformation
                missingInformation={result?.missingInformation}
              />
            </div>

            <ImprovementSuggestions suggestions={result?.suggestions} />
          </>
        )}

        {/* =================================================
            JOB MATCHING
        ================================================= */}

        {isJobMatchingType && (
          <>
            {selectedJob && (
              <div className="ai-answer-selected-job">
                <div>
                  <span>ANALYZED JOB</span>

                  <h3>{selectedJob.title || "Selected Job"}</h3>

                  <p>
                    {selectedJob?.company?.name ||
                      selectedJob?.companyName ||
                      "Company"}
                  </p>
                </div>
              </div>
            )}

            <JobMatchResult result={result} />
          </>
        )}

        {/* =================================================
            JOB RECOMMENDATIONS
        ================================================= */}

        {isRecommendations && (
          <RecommendationsResult recommendations={result} />
        )}

        {/* =================================================
            SKILL GAP
        ================================================= */}

        {isSkillGap && (
          <>
            {selectedJob && (
              <div className="ai-answer-selected-job">
                <div>
                  <span>TARGET JOB</span>

                  <h3>{selectedJob.title || "Selected Job"}</h3>

                  <p>
                    {selectedJob?.company?.name ||
                      selectedJob?.companyName ||
                      "Company"}
                  </p>
                </div>
              </div>
            )}

            <SkillGapResult result={result} />
          </>
        )}

        {/* =================================================
            INTERVIEW PREPARATION
        ================================================= */}

        {isInterviewPreparation && (
          <>
            {selectedJob && (
              <div className="ai-answer-selected-job">
                <div>
                  <span>INTERVIEW FOR</span>

                  <h3>{selectedJob.title || "Selected Job"}</h3>

                  <p>
                    {selectedJob?.company?.name ||
                      selectedJob?.companyName ||
                      "Company"}
                  </p>
                </div>
              </div>
            )}

            <InterviewPreparationResult result={result} />
          </>
        )}

        {/* =================================================
            BOTTOM ACTION
        ================================================= */}

        <div className="ai-answer-bottom-actions">
          <button type="button" onClick={() => navigate("/ai-career")}>
            ← Run Another AI Analysis
          </button>
        </div>
      </div>
    </main>
  );
};

export default AIAnswer;
