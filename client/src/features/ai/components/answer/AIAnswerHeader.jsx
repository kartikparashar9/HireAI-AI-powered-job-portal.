import { useNavigate } from "react-router-dom";

const AIAnswerHeader = ({ analysisType, resumeTitle }) => {
  const navigate = useNavigate();

  const titles = {
    RESUME_ANALYSIS: "AI Resume Analysis",
    JOB_MATCHING: "AI Job Matching",
    JOB_RECOMMENDATION: "AI Job Recommendations",
    SKILL_GAP: "AI Skill Gap Analysis",
    INTERVIEW_PREPARATION: "AI Interview Preparation",
  };

  const subtitles = {
    RESUME_ANALYSIS:
      "Detailed insights and improvement suggestions based on your resume.",
    JOB_MATCHING: "See how closely your profile matches the selected job.",
    JOB_RECOMMENDATION:
      "AI-powered job recommendations based on your career profile.",
    SKILL_GAP:
      "Understand which skills you need to improve for your target role.",
    INTERVIEW_PREPARATION:
      "Personalized preparation material for your target job.",
  };

  const title = titles[analysisType] || "AI Career Analysis";

  const subtitle =
    subtitles[analysisType] || "AI-powered insights for your career.";

  return (
    <header className="ai-answer-header">
      <button
        type="button"
        className="ai-back-button"
        onClick={() => navigate("/ai-career")}
      >
        ← Back to AI Career
      </button>

      <div className="ai-answer-heading">
        <div className="ai-answer-heading__icon">✨</div>

        <div>
          <span className="ai-answer-eyebrow">AI CAREER</span>

          <h1>{title}</h1>

          <p>{subtitle}</p>

          {resumeTitle && (
            <div className="ai-resume-reference">
              Resume: <strong>{resumeTitle}</strong>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AIAnswerHeader;
