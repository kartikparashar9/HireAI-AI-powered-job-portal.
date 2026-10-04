import AIResultCard from "../components/common/AIResultCard";
import { toArray } from "../../../utils/aiAnswerUtils";

const SkillGapResult = ({ result }) => {
  const currentSkills = toArray(result?.currentSkills);

  const requiredSkills = toArray(result?.requiredSkills);

  const gaps = toArray(result?.skillGaps);

  const learningPlan = toArray(result?.learningPlan);

  return (
    <div className="ai-special-result">
      <div className="ai-result-two-column">
        <AIResultCard
          title="Your Current Skills"
          icon="✓"
          count={currentSkills.length}
        >
          <div className="ai-skill-list">
            {currentSkills.map((skill, index) => (
              <span className="ai-skill-tag ai-skill-tag--success" key={index}>
                {typeof skill === "string"
                  ? skill
                  : skill?.name || skill?.skill || "Skill"}
              </span>
            ))}
          </div>
        </AIResultCard>

        <AIResultCard
          title="Required Skills"
          icon="🎯"
          count={requiredSkills.length}
        >
          <div className="ai-skill-list">
            {requiredSkills.map((skill, index) => (
              <span className="ai-skill-tag" key={index}>
                {typeof skill === "string"
                  ? skill
                  : skill?.name || skill?.skill || "Skill"}
              </span>
            ))}
          </div>
        </AIResultCard>
      </div>

      <AIResultCard
        title="Skill Gaps"
        subtitle="Skills you should focus on improving."
        icon="⚠"
        count={gaps.length}
      >
        <div className="ai-gap-list">
          {gaps.map((gap, index) => {
            if (typeof gap === "string") {
              return (
                <div className="ai-gap-item" key={index}>
                  <strong>{gap}</strong>
                </div>
              );
            }

            return (
              <div className="ai-gap-item" key={index}>
                <div>
                  <h3>{gap?.skill || gap?.name || "Skill Gap"}</h3>

                  {gap?.importance && (
                    <span
                      className={`ai-importance ai-importance--${String(
                        gap.importance,
                      ).toLowerCase()}`}
                    >
                      {gap.importance}
                    </span>
                  )}
                </div>

                {gap?.reason && <p>{gap.reason}</p>}
              </div>
            );
          })}
        </div>
      </AIResultCard>

      <AIResultCard
        title="Learning Plan"
        subtitle="Suggested roadmap for closing your skill gaps."
        icon="📚"
      >
        <div className="ai-learning-plan">
          {learningPlan.map((step, index) => (
            <div className="ai-learning-step" key={index}>
              <span>{index + 1}</span>

              <p>
                {typeof step === "string"
                  ? step
                  : step?.step ||
                    step?.description ||
                    step?.topic ||
                    "Learning step"}
              </p>
            </div>
          ))}
        </div>
      </AIResultCard>
    </div>
  );
};

export default SkillGapResult;
