import AIResultCard from "../common/AIResultCard";
import { toArray, safeText } from "../../../../utils/aiAnswerUtils";

const ExperienceSection = ({ experience }) => {
  const items = toArray(experience);

  return (
    <AIResultCard
      title="Work Experience"
      subtitle="Professional experience identified from your resume."
      icon="💼"
      count={`${items.length} entries`}
    >
      <div className="ai-experience-list">
        {items.length > 0 ? (
          items.map((item, index) => {
            const company = safeText(item?.company, "Company not specified");

            const role = safeText(item?.role, "Role not specified");

            const duration = safeText(item?.duration, "Duration not specified");

            const highlights = toArray(item?.highlights);

            return (
              <article className="ai-experience-item" key={index}>
                <div className="ai-experience-top">
                  <div>
                    <h3>{company}</h3>
                    <span>{role}</span>
                  </div>

                  <time>{duration}</time>
                </div>

                {highlights.length > 0 && (
                  <ul>
                    {highlights.map((highlight, highlightIndex) => (
                      <li key={highlightIndex}>
                        {typeof highlight === "string"
                          ? highlight
                          : highlight?.text ||
                            highlight?.description ||
                            "Experience detail"}
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            );
          })
        ) : (
          <p className="ai-muted">No work experience was identified.</p>
        )}
      </div>
    </AIResultCard>
  );
};

export default ExperienceSection;
