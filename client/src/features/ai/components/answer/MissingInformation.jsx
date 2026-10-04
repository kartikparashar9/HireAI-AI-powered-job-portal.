import AIResultCard from "../common/AIResultCard";
import { toArray } from "../../../../utils/aiAnswerUtils";

const MissingInformation = ({ missingInformation }) => {
  const items = toArray(missingInformation);

  return (
    <AIResultCard
      title="Missing Information"
      subtitle="Details that could make your resume stronger."
      icon="⚠"
      count={`${items.length} items`}
    >
      <div className="ai-warning-list">
        {items.length > 0 ? (
          items.map((item, index) => {
            const text =
              typeof item === "string"
                ? item
                : item?.text ||
                  item?.description ||
                  item?.field ||
                  "Information missing";

            return (
              <div className="ai-warning-item" key={index}>
                <span>{index + 1}</span>
                <p>{text}</p>
              </div>
            );
          })
        ) : (
          <div className="ai-no-warning">
            ✓ No major missing information identified.
          </div>
        )}
      </div>
    </AIResultCard>
  );
};

export default MissingInformation;
