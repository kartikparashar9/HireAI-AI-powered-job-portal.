import AIResultCard from "../common/AIResultCard";
import { toArray } from "../../../../utils/aiAnswerUtils";

const StrengthsSection = ({ strengths }) => {
  const items = toArray(strengths);

  return (
    <AIResultCard
      title="Strengths"
      subtitle="What your resume does well."
      icon="★"
      count={`${items.length} strengths`}
    >
      <div className="ai-numbered-list">
        {items.map((strength, index) => {
          const text =
            typeof strength === "string"
              ? strength
              : strength?.description ||
                strength?.text ||
                strength?.title ||
                "Strength identified";

          return (
            <div className="ai-numbered-item" key={index}>
              <span>{index + 1}</span>

              <p>{text}</p>
            </div>
          );
        })}
      </div>
    </AIResultCard>
  );
};

export default StrengthsSection;
