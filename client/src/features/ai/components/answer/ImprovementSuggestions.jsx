import AIResultCard from "../common/AIResultCard";
import { toArray } from "../../../../utils/aiAnswerUtils";

const ImprovementSuggestions = ({ suggestions }) => {
  const items = toArray(suggestions);

  return (
    <AIResultCard
      title="Improvement Suggestions"
      subtitle="Practical actions you can take to improve your resume."
      icon="💡"
      count={`${items.length} suggestions`}
      className="ai-suggestions-card"
    >
      <div className="ai-suggestion-list">
        {items.map((item, index) => {
          const text =
            typeof item === "string"
              ? item
              : item?.text ||
                item?.description ||
                item?.suggestion ||
                "Improvement suggestion";

          return (
            <div className="ai-suggestion-item" key={index}>
              <span>{index + 1}</span>
              <p>{text}</p>
            </div>
          );
        })}
      </div>
    </AIResultCard>
  );
};

export default ImprovementSuggestions;
