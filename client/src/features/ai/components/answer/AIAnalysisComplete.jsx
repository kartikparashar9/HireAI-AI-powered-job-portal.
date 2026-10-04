const AIAnalysisComplete = ({ score, scoreLabel, analysisType }) => {
  const isResume = analysisType === "RESUME_ANALYSIS";

  return (
    <div className="ai-complete-banner">
      <div className="ai-complete-banner__left">
        <div className="ai-complete-banner__check">✓</div>

        <div>
          <span>AI ANALYSIS COMPLETE</span>

          <p>
            {isResume
              ? "Your resume has been analyzed successfully. Here are your detailed AI-powered insights."
              : "Your AI-powered analysis has been completed successfully."}
          </p>
        </div>
      </div>

      {score !== undefined && score !== null && (
        <div className="ai-score-box">
          <div
            className="ai-score-circle"
            style={{
              "--score": `${score}%`,
            }}
          >
            <strong>{score}</strong>
          </div>

          <div>
            <small>{scoreLabel}</small>
            <strong>{score}/100</strong>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAnalysisComplete;
