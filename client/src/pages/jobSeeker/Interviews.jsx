import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchMyInterviews,
  selectInterviewError,
  selectInterviews,
  selectInterviewsLoading,
} from "../../features/interviews/interviewSlice";

import InterviewCard from "../../features/interviews/components/InterviewCard";

import "./Interview.css";

const InterviewsPage = () => {
  const dispatch = useDispatch();

  const interviews = useSelector(selectInterviews);
  const isLoading = useSelector(selectInterviewsLoading);
  const error = useSelector(selectInterviewError);

  useEffect(() => {
    dispatch(fetchMyInterviews());
  }, [dispatch]);

  return (
    <div className="interviews-page">
      <div className="interviews-container">
        <div className="interviews-header">
          <div>
            <span className="interviews-eyebrow">Career</span>

            <h1>My Interviews</h1>

            <p>View and manage your upcoming and past interviews.</p>
          </div>
        </div>

        {isLoading && (
          <div className="interviews-loading">
            <div className="interview-loading-card" />
            <div className="interview-loading-card" />
          </div>
        )}

        {!isLoading && error && (
          <div className="interviews-error">
            <h2>Unable to load interviews</h2>
            <p>{error}</p>

            <button type="button" onClick={() => dispatch(fetchMyInterviews())}>
              Try Again
            </button>
          </div>
        )}

        {!isLoading && !error && interviews.length === 0 && (
          <div className="interviews-empty">
            <div className="interviews-empty-icon">📅</div>

            <h2>No interviews yet</h2>

            <p>Your scheduled interviews will appear here.</p>
          </div>
        )}

        {!isLoading && !error && interviews.length > 0 && (
          <div className="interviews-list">
            {interviews.map((interview) => (
              <InterviewCard key={interview._id} interview={interview} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewsPage;
