import AIResultCard from "../components/common/AIResultCard";
import { toArray, getMatchScore } from "../../../utils/aiAnswerUtils";

const RecommendationsResult = ({ recommendations }) => {
  const jobs = toArray(recommendations);

  return (
    <div className="ai-recommendation-list">
      {jobs.map((job, index) => {
        const score = getMatchScore(job);

        const matchedSkills = toArray(job?.matchedSkills);

        const missingSkills = toArray(job?.missingSkills);

        return (
          <AIResultCard
            key={job?.jobId || index}
            title={`Recommendation ${index + 1}`}
            subtitle={job?.jobTitle || job?.title || "Recommended Job"}
            icon="🎯"
            count={`${score}% match`}
          >
            <div className="ai-recommendation-score">
              <span>Match Score</span>
              <strong>{score}%</strong>
            </div>

            <div className="ai-recommendation-reason">
              <h4>Why this job?</h4>
              <p>
                {job?.reason ||
                  "This role matches your profile based on the available resume information."}
              </p>
            </div>

            <div className="ai-recommendation-skills">
              <div>
                <h4>Matched Skills</h4>

                <div className="ai-skill-list">
                  {matchedSkills.map((skill, skillIndex) => (
                    <span
                      className="ai-skill-tag ai-skill-tag--success"
                      key={skillIndex}
                    >
                      {typeof skill === "string"
                        ? skill
                        : skill?.name || skill?.skill || "Skill"}
                    </span>
                  ))}
                </div>
              </div>

              {missingSkills.length > 0 && (
                <div>
                  <h4>Skills to Improve</h4>

                  <div className="ai-skill-list">
                    {missingSkills.map((skill, skillIndex) => (
                      <span
                        className="ai-skill-tag ai-skill-tag--danger"
                        key={skillIndex}
                      >
                        {typeof skill === "string"
                          ? skill
                          : skill?.name || skill?.skill || "Skill"}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {job?.jobId && <div className="ai-job-id">Job ID: {job.jobId}</div>}
          </AIResultCard>
        );
      })}
    </div>
  );
};

export default RecommendationsResult;
