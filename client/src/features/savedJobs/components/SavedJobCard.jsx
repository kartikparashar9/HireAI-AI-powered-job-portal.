import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { removeSavedJob } from "../savedJobSlice";

const getJob = (item) => {
  return item.job || item;
};

const getCompanyName = (job) => {
  if (typeof job.company === "string") {
    return job.company;
  }

  return job.company?.name || "Company";
};

const SavedJobCard = ({ item }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const job = getJob(item);

  const removing =
    useSelector((state) => state.savedJobs.isRemoving[job._id]) || false;

  const companyName = getCompanyName(job);

  const handleRemove = () => {
    if (!removing) {
      dispatch(removeSavedJob(job._id));
    }
  };

  return (
    <article className="saved-job-card">
      <div className="saved-job-main">
        <div className="saved-job-logo">
          {job.company?.logo ? (
            <img src={job.company.logo} alt={companyName} />
          ) : (
            companyName.charAt(0).toUpperCase()
          )}
        </div>

        <div className="saved-job-info">
          <span className="saved-job-company">{companyName}</span>

          <h3>{job.title}</h3>

          <div className="saved-job-meta">
            <span>{job.location || "Location not specified"}</span>

            {job.workMode && (
              <>
                <span>•</span>
                <span>{job.workMode}</span>
              </>
            )}

            {job.jobType && (
              <>
                <span>•</span>
                <span>{job.jobType.replace(/_/g, " ")}</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="saved-job-actions">
        <button
          type="button"
          className="saved-job-view"
          onClick={() => navigate(`/jobs/${job._id}`)}
        >
          View Job
        </button>

        <button
          type="button"
          className="saved-job-remove"
          disabled={removing}
          onClick={handleRemove}
        >
          {removing ? "Removing..." : "Remove"}
        </button>
      </div>
    </article>
  );
};

export default SavedJobCard;
