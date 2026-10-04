import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchRecruiterProfile,
  createRecruiterProfile,
  updateRecruiterProfile,
  clearRecruiterError,
  clearRecruiterSuccess,
} from "../recruiterSlice";

import "../recruiter.css";

const emptyForm = {
  phone: "",
  headline: "",
  about: "",
  location: "",
  skills: "",
  linkedin: "",
  github: "",
  portfolio: "",
};

const profileToForm = (profile) => ({
  phone: profile?.phone || "",
  headline: profile?.headline || "",
  about: profile?.about || "",
  location: profile?.location || "",
  skills: Array.isArray(profile?.skills) ? profile.skills.join(", ") : "",
  linkedin: profile?.socialLinks?.linkedin || "",
  github: profile?.socialLinks?.github || "",
  portfolio: profile?.socialLinks?.portfolio || "",
});

const RecruiterProfile = () => {
  const dispatch = useDispatch();

  const {
    profile,
    profileLoading,
    profileError,
    isSubmitting,
    successMessage,
  } = useSelector((state) => state.recruiter);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    dispatch(fetchRecruiterProfile());

    return () => {
      dispatch(clearRecruiterError());
      dispatch(clearRecruiterSuccess());
    };
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setFormData(profileToForm(profile));
    }
  }, [profile]);

  useEffect(() => {
    if (!successMessage) return;

    setIsEditing(false);

    const timer = setTimeout(() => {
      dispatch(clearRecruiterSuccess());
    }, 2500);

    return () => clearTimeout(timer);
  }, [successMessage, dispatch]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleEdit = () => {
    setFormData(profileToForm(profile));
    setIsEditing(true);
    dispatch(clearRecruiterError());
    dispatch(clearRecruiterSuccess());
  };

  const handleCancel = () => {
    setFormData(profileToForm(profile));
    setIsEditing(false);
    dispatch(clearRecruiterError());
  };

  const buildPayload = () => ({
    phone: formData.phone.trim(),
    headline: formData.headline.trim(),
    about: formData.about.trim(),
    location: formData.location.trim(),
    skills: formData.skills
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean),
    socialLinks: {
      linkedin: formData.linkedin.trim(),
      github: formData.github.trim(),
      portfolio: formData.portfolio.trim(),
    },
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = buildPayload();

    if (profile) {
      await dispatch(updateRecruiterProfile(payload));
      return;
    }

    await dispatch(createRecruiterProfile(payload));
  };

  if (profileLoading) {
    return (
      <div className="recruiter-page">
        <div className="recruiter-loading">Loading profile...</div>
      </div>
    );
  }

  if (profileError && !profile) {
    return (
      <div className="recruiter-page">
        <div className="recruiter-error">
          <p>{profileError}</p>

          <button
            type="button"
            onClick={() => dispatch(fetchRecruiterProfile())}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="recruiter-page">
        <div className="recruiter-page-header">
          <div>
            <p className="recruiter-page-eyebrow">Recruiter</p>
            <h1>My Profile</h1>
            <p>Create your recruiter profile.</p>
          </div>
        </div>

        {profileError && (
          <div className="recruiter-error-message">{profileError}</div>
        )}

        <div className="recruiter-profile-card">
          <div className="recruiter-profile-header">
            <div className="recruiter-profile-heading">
              <h2>Create Profile</h2>
              <p>Add your professional information.</p>
            </div>
          </div>

          <form className="recruiter-profile-form" onSubmit={handleSubmit}>
            <div className="recruiter-form-group">
              <label htmlFor="phone">Phone</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                maxLength={20}
              />
            </div>

            <div className="recruiter-form-group">
              <label htmlFor="headline">Headline</label>
              <input
                id="headline"
                name="headline"
                type="text"
                value={formData.headline}
                onChange={handleChange}
                maxLength={150}
              />
            </div>

            <div className="recruiter-form-group">
              <label htmlFor="location">Location</label>
              <input
                id="location"
                name="location"
                type="text"
                value={formData.location}
                onChange={handleChange}
                maxLength={150}
              />
            </div>

            <div className="recruiter-form-group">
              <label htmlFor="skills">Skills</label>
              <input
                id="skills"
                name="skills"
                type="text"
                value={formData.skills}
                onChange={handleChange}
                placeholder="React, Node.js, Hiring"
              />
            </div>

            <div className="recruiter-form-group">
              <label htmlFor="about">About</label>
              <textarea
                id="about"
                name="about"
                value={formData.about}
                onChange={handleChange}
                maxLength={3000}
                rows={5}
              />
            </div>

            <div className="recruiter-form-group">
              <label htmlFor="linkedin">LinkedIn URL</label>
              <input
                id="linkedin"
                name="linkedin"
                type="url"
                value={formData.linkedin}
                onChange={handleChange}
              />
            </div>

            <div className="recruiter-form-group">
              <label htmlFor="github">GitHub URL</label>
              <input
                id="github"
                name="github"
                type="url"
                value={formData.github}
                onChange={handleChange}
              />
            </div>

            <div className="recruiter-form-group">
              <label htmlFor="portfolio">Portfolio URL</label>
              <input
                id="portfolio"
                name="portfolio"
                type="url"
                value={formData.portfolio}
                onChange={handleChange}
              />
            </div>

            <div className="recruiter-form-actions">
              <button
                type="submit"
                className="recruiter-save-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating..." : "Create Profile"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  const user = profile.user || {};
  const displayName = user.name || "Recruiter";

  return (
    <div className="recruiter-page">
      <div className="recruiter-page-header">
        <div>
          <p className="recruiter-page-eyebrow">Recruiter</p>
          <h1>My Profile</h1>
          <p>View and manage your recruiter profile.</p>
        </div>
      </div>

      {successMessage && (
        <div className="recruiter-success-message">{successMessage}</div>
      )}

      {profileError && (
        <div className="recruiter-error-message">{profileError}</div>
      )}

      <div className="recruiter-profile-card">
        <div className="recruiter-profile-header">
          <div className="recruiter-avatar">
            {user.avatar ? (
              <img src={user.avatar} alt={displayName} />
            ) : (
              <span>{displayName.charAt(0).toUpperCase()}</span>
            )}
          </div>

          <div className="recruiter-profile-heading">
            <h2>{displayName}</h2>
            <p>{user.email || "No email available"}</p>

            {user.role && (
              <span className="recruiter-status">
                {user.role}
              </span>
            )}
          </div>

          {!isEditing && (
            <button
              type="button"
              className="recruiter-edit-button"
              onClick={handleEdit}
            >
              Edit Profile
            </button>
          )}
        </div>

        {isEditing ? (
          <form className="recruiter-profile-form" onSubmit={handleSubmit}>
            <div className="recruiter-form-group">
              <label htmlFor="phone">Phone</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                maxLength={20}
              />
            </div>

            <div className="recruiter-form-group">
              <label htmlFor="headline">Headline</label>
              <input
                id="headline"
                name="headline"
                type="text"
                value={formData.headline}
                onChange={handleChange}
                maxLength={150}
              />
            </div>

            <div className="recruiter-form-group">
              <label htmlFor="location">Location</label>
              <input
                id="location"
                name="location"
                type="text"
                value={formData.location}
                onChange={handleChange}
                maxLength={150}
              />
            </div>

            <div className="recruiter-form-group">
              <label htmlFor="skills">Skills</label>
              <input
                id="skills"
                name="skills"
                type="text"
                value={formData.skills}
                onChange={handleChange}
                placeholder="React, Node.js, Hiring"
              />
            </div>

            <div className="recruiter-form-group">
              <label htmlFor="about">About</label>
              <textarea
                id="about"
                name="about"
                value={formData.about}
                onChange={handleChange}
                maxLength={3000}
                rows={5}
              />
            </div>

            <div className="recruiter-form-group">
              <label htmlFor="linkedin">LinkedIn URL</label>
              <input
                id="linkedin"
                name="linkedin"
                type="url"
                value={formData.linkedin}
                onChange={handleChange}
              />
            </div>

            <div className="recruiter-form-group">
              <label htmlFor="github">GitHub URL</label>
              <input
                id="github"
                name="github"
                type="url"
                value={formData.github}
                onChange={handleChange}
              />
            </div>

            <div className="recruiter-form-group">
              <label htmlFor="portfolio">Portfolio URL</label>
              <input
                id="portfolio"
                name="portfolio"
                type="url"
                value={formData.portfolio}
                onChange={handleChange}
              />
            </div>

            <div className="recruiter-form-actions">
              <button
                type="button"
                className="recruiter-cancel-button"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="recruiter-save-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        ) : (
          <div className="recruiter-profile-details">
            <div className="recruiter-profile-field">
              <span>Name</span>
              <strong>{user.name || "—"}</strong>
            </div>

            <div className="recruiter-profile-field">
              <span>Email</span>
              <strong>{user.email || "—"}</strong>
            </div>

            <div className="recruiter-profile-field">
              <span>Role</span>
              <strong>{user.role || "RECRUITER"}</strong>
            </div>

            <div className="recruiter-profile-field">
              <span>Phone</span>
              <strong>{profile.phone || "—"}</strong>
            </div>

            <div className="recruiter-profile-field">
              <span>Headline</span>
              <strong>{profile.headline || "—"}</strong>
            </div>

            <div className="recruiter-profile-field">
              <span>Location</span>
              <strong>{profile.location || "—"}</strong>
            </div>

            <div className="recruiter-profile-field">
              <span>Profile Completion</span>
              <strong>{profile.profileCompletion ?? 0}%</strong>
            </div>

            <div className="recruiter-profile-field">
              <span>Email Verified</span>
              <strong>
                {user.isEmailVerified ? "Verified" : "Not Verified"}
              </strong>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecruiterProfile;
