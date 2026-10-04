import AIResultCard from "../common/AIResultCard";
import { safeText } from "../../../../utils/aiAnswerUtils";

const ResumeSummary = ({ summary }) => {
  return (
    <AIResultCard
      title="Resume Summary"
      subtitle="AI-generated overview of your professional profile."
      icon="📄"
      className="ai-summary-card"
    >
      <p className="ai-summary-text">{safeText(summary)}</p>
    </AIResultCard>
  );
};

export default ResumeSummary;
