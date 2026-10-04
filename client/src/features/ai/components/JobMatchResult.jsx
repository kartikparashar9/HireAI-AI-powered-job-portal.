import AIResultCard from "../components/common/AIResultCard";
import {
  toArray,
  safeText,
  getMatchScore,
  getScoreLabel,
} from "../../../utils/aiAnswerUtils";

const JobMatchResult = ({ result }) => {
  const score = getMatchScore(result);

  const matchedSkills = toArray(result?.matchedSkills);

  const missingSkills = toArray(result?.missingSkills);

  return (
    <div className="ai-special-result">
      <div className="ai-match-hero">
        <div>
          <span>JOB MATCH SCORE</span>
          <strong>{score}%</strong>
          <p>{getScoreLabel(score)}</p>
        </div>

        <div className="ai-match-progress">
          <div
            style={{
              width: `${score}%`,
            }}
          />
        </div>
      </div>

      <div className="ai-result-two-column">
        <AIResultCard
          title="Matched Skills"
          icon="✓"
          count={`${matchedSkills.length}`}
        >
          <div className="ai-skill-list">
            {matchedSkills.map((skill, index) => (
              <span className="ai-skill-tag ai-skill-tag--success" key={index}>
                {typeof skill === "string"
                  ? skill
                  : skill?.name || skill?.skill || "Skill"}
              </span>
            ))}
          </div>
        </AIResultCard>

        <AIResultCard
          title="Missing Skills"
          icon="!"
          count={`${missingSkills.length}`}
        >
          <div className="ai-skill-list">
            {missingSkills.map((skill, index) => (
              <span className="ai-skill-tag ai-skill-tag--danger" key={index}>
                {typeof skill === "string"
                  ? skill
                  : skill?.name || skill?.skill || "Skill"}
              </span>
            ))}
          </div>
        </AIResultCard>
      </div>

      <AIResultCard title="Matching Experience" icon="💼">
        <p className="ai-long-text">
          {safeText(
            result?.matchingExperience,
            "No matching experience details were provided.",
          )}
        </p>
      </AIResultCard>

      <AIResultCard title="Experience Gaps" icon="⚠">
        <p className="ai-long-text">
          {safeText(
            result?.experienceGaps,
            "No major experience gaps were identified.",
          )}
        </p>
      </AIResultCard>

      <AIResultCard title="AI Explanation" icon="✨">
        <p className="ai-long-text">
          {safeText(result?.explanation, "No explanation was provided.")}
        </p>
      </AIResultCard>
    </div>
  );
};

export default JobMatchResult;
