import AIResultCard from "../common/AIResultCard";
import { toArray } from "../../../../utils/aiAnswerUtils";

const SkillsSection = ({ skills }) => {
  const items = toArray(skills);

  return (
    <AIResultCard
      title="Skills"
      subtitle="Technologies and skills identified from your resume."
      icon="⚙"
      count={`${items.length} skills`}
    >
      {items.length > 0 ? (
        <div className="ai-skill-list">
          {items.map((skill, index) => {
            const text =
              typeof skill === "string"
                ? skill
                : skill?.name || skill?.skill || "Skill";

            return (
              <span className="ai-skill-tag" key={`${text}-${index}`}>
                {text}
              </span>
            );
          })}
        </div>
      ) : (
        <p className="ai-muted">No specific skills were identified.</p>
      )}
    </AIResultCard>
  );
};

export default SkillsSection;
