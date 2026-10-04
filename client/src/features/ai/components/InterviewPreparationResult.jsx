import AIResultCard from "../components/common/AIResultCard";
import { toArray, safeText } from "../../../utils/aiAnswerUtils";

const InterviewPreparationResult = ({ result }) => {
  const technicalQuestions = toArray(result?.technicalQuestions);

  const behavioralQuestions = toArray(result?.behavioralQuestions);

  const preparationTopics = toArray(result?.preparationTopics);

  const tips = toArray(result?.tips);

  return (
    <div className="ai-special-result">
      <AIResultCard
        title="Role Overview"
        subtitle="AI-generated overview of what you should focus on."
        icon="🎯"
      >
        <p className="ai-long-text">
          {safeText(result?.roleOverview, "No role overview available.")}
        </p>
      </AIResultCard>

      <div className="ai-result-two-column">
        <AIResultCard
          title="Technical Questions"
          icon="💻"
          count={technicalQuestions.length}
        >
          <div className="ai-question-list">
            {technicalQuestions.map((question, index) => (
              <div className="ai-question-item" key={index}>
                <span>{index + 1}</span>
                <p>
                  {typeof question === "string"
                    ? question
                    : question?.question ||
                      question?.text ||
                      "Technical question"}
                </p>
              </div>
            ))}
          </div>
        </AIResultCard>

        <AIResultCard
          title="Behavioral Questions"
          icon="👤"
          count={behavioralQuestions.length}
        >
          <div className="ai-question-list">
            {behavioralQuestions.map((question, index) => (
              <div className="ai-question-item" key={index}>
                <span>{index + 1}</span>
                <p>
                  {typeof question === "string"
                    ? question
                    : question?.question ||
                      question?.text ||
                      "Behavioral question"}
                </p>
              </div>
            ))}
          </div>
        </AIResultCard>
      </div>

      <AIResultCard
        title="Preparation Topics"
        icon="📚"
        count={preparationTopics.length}
      >
        <div className="ai-topic-list">
          {preparationTopics.map((topic, index) => (
            <div className="ai-topic-item" key={index}>
              <span>{index + 1}</span>

              <p>
                {typeof topic === "string"
                  ? topic
                  : topic?.topic || topic?.description || "Preparation topic"}
              </p>
            </div>
          ))}
        </div>
      </AIResultCard>

      <AIResultCard title="Interview Tips" icon="💡" count={tips.length}>
        <div className="ai-tip-list">
          {tips.map((tip, index) => (
            <div className="ai-tip-item" key={index}>
              <span>✓</span>

              <p>
                {typeof tip === "string"
                  ? tip
                  : tip?.tip ||
                    tip?.text ||
                    tip?.description ||
                    "Interview tip"}
              </p>
            </div>
          ))}
        </div>
      </AIResultCard>
    </div>
  );
};

export default InterviewPreparationResult;
