import AIResultCard from "../common/AIResultCard";
import { toArray, safeText } from "../../../../utils/aiAnswerUtils";

const EducationSection = ({ education }) => {
  const items = toArray(education);

  return (
    <AIResultCard
      title="Education"
      subtitle="Academic background identified from your resume."
      icon="🎓"
      count={`${items.length} entries`}
    >
      <div className="ai-education-list">
        {items.length > 0 ? (
          items.map((item, index) => (
            <article className="ai-education-item" key={index}>
              <div>
                <h3>{safeText(item?.degree, "Degree not specified")}</h3>

                <p>
                  {safeText(item?.institution, "Institution not specified")}
                </p>
              </div>

              <span>{safeText(item?.year, "Year not specified")}</span>
            </article>
          ))
        ) : (
          <p className="ai-muted">No education details were identified.</p>
        )}
      </div>
    </AIResultCard>
  );
};

export default EducationSection;
