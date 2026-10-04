import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import SavedJobCard from "../../features/savedJobs/components/SavedJobCard";
import { fetchSavedJobs } from "../../features/savedJobs/savedJobSlice";

import "./SavedJobs.css";

const SavedJobs = () => {
  const dispatch = useDispatch();

  const { jobs, isLoading, error } = useSelector((state) => state.savedJobs);

  useEffect(() => {
    dispatch(fetchSavedJobs());
  }, [dispatch]);

  return (
    <div className="saved-jobs-page">
      <div className="saved-jobs-header">
        <div>
          <span className="saved-jobs-eyebrow">MY JOBS</span>

          <h1>Saved Jobs</h1>

          <p>Jobs you've saved for later.</p>
        </div>

        <div className="saved-jobs-count">{jobs.length}</div>
      </div>

      {error && <div className="saved-jobs-error">{error}</div>}

      {isLoading ? (
        <div className="saved-jobs-loading">Loading saved jobs...</div>
      ) : jobs.length === 0 ? (
        <div className="saved-jobs-empty">
          <div className="saved-jobs-empty-icon">♡</div>

          <h2>No saved jobs yet</h2>

          <p>Save jobs you're interested in and they'll appear here.</p>
        </div>
      ) : (
        <div className="saved-jobs-list">
          {jobs.map((item) => {
            const job = item.job || item;

            return <SavedJobCard key={item._id || job._id} item={item} />;
          })}
        </div>
      )}
    </div>
  );
};

export default SavedJobs;
