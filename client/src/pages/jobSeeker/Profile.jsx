import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchProfile,
  selectProfile,
  selectHasProfile,
  selectProfileLoading,
  selectProfileError,
} from "../../features/profile/profileSlice";

import ProfileForm from "../../features/profile/components/ProfileForm";

import "./Profile.css";

const Profile = () => {
  const dispatch = useDispatch();

  const profile = useSelector(selectProfile);
  const hasProfile = useSelector(selectHasProfile);
  const isLoading = useSelector(selectProfileLoading);
  const error = useSelector(selectProfileError);

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="profile-page">
        <div className="profile-loading-card">
          <div className="profile-spinner" />
          <p>Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-page">
        <div className="profile-error-card">
          <div className="profile-error-icon">!</div>

          <div>
            <h2>Unable to load profile</h2>
            <p>{error}</p>

            <button
              type="button"
              className="profile-retry-btn"
              onClick={() => dispatch(fetchProfile())}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-page-header">
        <div>
          <span className="profile-eyebrow">Career Profile</span>

          <h1>{hasProfile ? "My Profile" : "Build Your Profile"}</h1>

          <p>
            {hasProfile
              ? "Keep your professional information updated to improve your job applications and career recommendations."
              : "Create your professional profile to improve job matching and career recommendations."}
          </p>
        </div>

        {hasProfile && (
          <div className="profile-header-status">
            <span className="status-dot" />
            Profile Active
          </div>
        )}
      </div>

      <ProfileForm profile={profile} />
    </div>
  );
};

export default Profile;