import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  createProfile,
  updateProfile,
  deleteProfile,
  selectProfileSaving,
  selectProfileDeleting,
  selectProfileError,
  selectProfileSuccess,
  clearProfileError,
  clearProfileSuccess,
} from "../profileSlice";

const emptyExperience = {
  company: "",
  position: "",
  location: "",
  startDate: "",
  endDate: "",
  isCurrent: false,
  description: "",
};

const emptyEducation = {
  institution: "",
  degree: "",
  field: "",
  startDate: "",
  endDate: "",
  grade: "",
};

const ProfileForm = ({ profile }) => {
  const dispatch = useDispatch();

  const isSaving = useSelector(selectProfileSaving);
  const error = useSelector(selectProfileError);
  const successMessage = useSelector(selectProfileSuccess);

  const hasProfile = Boolean(profile);

  const [formData, setFormData] = useState({
    phone: "",
    headline: "",
    about: "",
    location: "",
    skills: [],
    experience: [],
    education: [],
    linkedin: "",
    github: "",
    portfolio: "",
  });

  const [skillInput, setSkillInput] = useState("");
  const [showExperienceForm, setShowExperienceForm] = useState(false);
  const [experienceForm, setExperienceForm] = useState(emptyExperience);
  const [editingExperienceIndex, setEditingExperienceIndex] = useState(null);
  const [showEducationForm, setShowEducationForm] = useState(false);
  const [educationForm, setEducationForm] = useState(emptyEducation);
  const [editingEducationIndex, setEditingEducationIndex] = useState(null);
  const isDeleting = useSelector(selectProfileDeleting);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (!profile) {
      setFormData({
        phone: "",
        headline: "",
        about: "",
        location: "",
        skills: [],
        experience: [],
        education: [],
        linkedin: "",
        github: "",
        portfolio: "",
      });

      return;
    }

    setFormData({
      phone: profile.phone || "",
      headline: profile.headline || "",
      about: profile.about || "",
      location: profile.location || "",
      skills: Array.isArray(profile.skills) ? profile.skills : [],
      experience: Array.isArray(profile.experience) ? profile.experience : [],
      education: Array.isArray(profile.education) ? profile.education : [],
      linkedin: profile.socialLinks?.linkedin || "",
      github: profile.socialLinks?.github || "",
      portfolio: profile.socialLinks?.portfolio || "",
    });
  }, [profile]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    if (error) {
      dispatch(clearProfileError());
    }

    if (successMessage) {
      dispatch(clearProfileSuccess());
    }
  };

  /* ---------------- SKILLS ---------------- */

  const handleAddSkill = () => {
    const skill = skillInput.trim();

    if (!skill) return;

    const exists = formData.skills.some(
      (item) => item.toLowerCase() === skill.toLowerCase(),
    );

    if (exists) {
      setSkillInput("");
      return;
    }

    setFormData((current) => ({
      ...current,
      skills: [...current.skills, skill],
    }));

    setSkillInput("");
  };

  const handleSkillKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleAddSkill();
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData((current) => ({
      ...current,
      skills: current.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  /* ---------------- EXPERIENCE ---------------- */

  const handleExperienceChange = (event) => {
    const { name, value, type, checked } = event.target;

    setExperienceForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const resetExperienceForm = () => {
    setExperienceForm(emptyExperience);
    setEditingExperienceIndex(null);
    setShowExperienceForm(false);
  };

  const handleSaveExperience = () => {
    if (
      !experienceForm.company.trim() ||
      !experienceForm.position.trim() ||
      !experienceForm.startDate
    ) {
      return;
    }

    const experience = {
      ...experienceForm,
      company: experienceForm.company.trim(),
      position: experienceForm.position.trim(),
      location: experienceForm.location.trim(),
      description: experienceForm.description.trim(),
      endDate: experienceForm.isCurrent ? "" : experienceForm.endDate,
    };

    setFormData((current) => {
      const updated = [...current.experience];

      if (editingExperienceIndex !== null) {
        updated[editingExperienceIndex] = experience;
      } else {
        updated.push(experience);
      }

      return {
        ...current,
        experience: updated,
      };
    });

    resetExperienceForm();
  };

  const handleEditExperience = (index) => {
    setExperienceForm({
      ...emptyExperience,
      ...formData.experience[index],
    });

    setEditingExperienceIndex(index);
    setShowExperienceForm(true);
  };

  const handleRemoveExperience = (index) => {
    setFormData((current) => ({
      ...current,
      experience: current.experience.filter(
        (_, itemIndex) => itemIndex !== index,
      ),
    }));
  };

  /* ---------------- EDUCATION ---------------- */

  const handleEducationChange = (event) => {
    const { name, value } = event.target;

    setEducationForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const resetEducationForm = () => {
    setEducationForm(emptyEducation);
    setEditingEducationIndex(null);
    setShowEducationForm(false);
  };

  const handleSaveEducation = () => {
    if (
      !educationForm.institution.trim() ||
      !educationForm.degree.trim() ||
      !educationForm.startDate
    ) {
      return;
    }

    const education = {
      ...educationForm,
      institution: educationForm.institution.trim(),
      degree: educationForm.degree.trim(),
      field: educationForm.field.trim(),
      grade: educationForm.grade.trim(),
    };

    setFormData((current) => {
      const updated = [...current.education];

      if (editingEducationIndex !== null) {
        updated[editingEducationIndex] = education;
      } else {
        updated.push(education);
      }

      return {
        ...current,
        education: updated,
      };
    });

    resetEducationForm();
  };

  const handleEditEducation = (index) => {
    setEducationForm({
      ...emptyEducation,
      ...formData.education[index],
    });

    setEditingEducationIndex(index);
    setShowEducationForm(true);
  };

  const handleRemoveEducation = (index) => {
    setFormData((current) => ({
      ...current,
      education: current.education.filter(
        (_, itemIndex) => itemIndex !== index,
      ),
    }));
  };

  /* ---------------- SUBMIT ---------------- */

  const handleSubmit = (event) => {
    event.preventDefault();

    const payload = {
      phone: formData.phone.trim(),
      headline: formData.headline.trim(),
      about: formData.about.trim(),
      location: formData.location.trim(),

      skills: formData.skills,

      experience: formData.experience,

      education: formData.education,

      socialLinks: {
        linkedin: formData.linkedin.trim(),
        github: formData.github.trim(),
        portfolio: formData.portfolio.trim(),
      },
    };

    if (hasProfile) {
      dispatch(updateProfile(payload));
    } else {
      dispatch(createProfile(payload));
    }
  };

  const handleDeleteProfile = () => {
    dispatch(deleteProfile());
    setShowDeleteModal(false);
  };

  return (
    <form className="profile-form" onSubmit={handleSubmit}>
      <div className="profile-layout">
        <main className="profile-main">
          {/* PERSONAL INFORMATION */}

          <section className="profile-card">
            <div className="profile-card-header">
              <div className="profile-card-title">
                <div className="profile-section-icon">✦</div>

                <div>
                  <h2>Personal Information</h2>
                  <p>Basic details about you</p>
                </div>
              </div>

              {hasProfile && (
                <span className="profile-edit-badge">✎ Edit Mode</span>
              )}
            </div>

            <div className="profile-fields-grid">
              <div className="profile-field">
                <label htmlFor="phone">Phone Number</label>

                <div className="input-with-icon">
                  <span>☎</span>

                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>

              <div className="profile-field">
                <label htmlFor="location">Location</label>

                <div className="input-with-icon">
                  <span>⌖</span>

                  <input
                    id="location"
                    name="location"
                    type="text"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Bhopal, Madhya Pradesh"
                  />
                </div>
              </div>

              <div className="profile-field profile-field-full">
                <label htmlFor="headline">Professional Headline</label>

                <div className="input-with-icon">
                  <span>▣</span>

                  <input
                    id="headline"
                    name="headline"
                    type="text"
                    value={formData.headline}
                    onChange={handleChange}
                    placeholder="MERN Stack Developer"
                  />
                </div>
              </div>

              <div className="profile-field profile-field-full">
                <div className="profile-label-row">
                  <label htmlFor="about">About</label>

                  <span>{formData.about.length}/500</span>
                </div>

                <textarea
                  id="about"
                  name="about"
                  rows="5"
                  maxLength="500"
                  value={formData.about}
                  onChange={handleChange}
                  placeholder="Tell recruiters about yourself..."
                />
              </div>
            </div>
          </section>

          {/* SKILLS + SOCIAL */}

          <div className="profile-two-column">
            <section className="profile-card">
              <div className="profile-card-header">
                <div className="profile-card-title">
                  <div className="profile-section-icon">◉</div>

                  <div>
                    <h2>Skills</h2>
                    <p>Add skills recruiters should see</p>
                  </div>
                </div>
              </div>

              <div className="skill-input-row">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(event) => setSkillInput(event.target.value)}
                  onKeyDown={handleSkillKeyDown}
                  placeholder="e.g. React, Node.js, MongoDB"
                />

                <button
                  type="button"
                  className="add-blue-btn"
                  onClick={handleAddSkill}
                  disabled={!skillInput.trim()}
                >
                  + Add Skill
                </button>
              </div>

              <div className="skills-list">
                {formData.skills.length > 0 ? (
                  formData.skills.map((skill) => (
                    <div className="skill-chip" key={skill}>
                      <span>{skill}</span>

                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                      >
                        ×
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="empty-mini-state">
                    Add your technical skills
                  </div>
                )}
              </div>
            </section>

            <section className="profile-card">
              <div className="profile-card-header">
                <div className="profile-card-title">
                  <div className="profile-section-icon">↗</div>

                  <div>
                    <h2>Social Links</h2>
                    <p>Connect your professional profiles</p>
                  </div>
                </div>
              </div>

              <div className="social-fields">
                <div className="profile-field">
                  <label htmlFor="linkedin">LinkedIn</label>

                  <div className="social-input">
                    <span>in</span>

                    <input
                      id="linkedin"
                      name="linkedin"
                      type="url"
                      value={formData.linkedin}
                      onChange={handleChange}
                      placeholder="https://linkedin.com/in/..."
                    />
                  </div>
                </div>

                <div className="profile-field">
                  <label htmlFor="github">GitHub</label>

                  <div className="social-input">
                    <span>⌘</span>

                    <input
                      id="github"
                      name="github"
                      type="url"
                      value={formData.github}
                      onChange={handleChange}
                      placeholder="https://github.com/..."
                    />
                  </div>
                </div>

                <div className="profile-field">
                  <label htmlFor="portfolio">Portfolio</label>

                  <div className="social-input">
                    <span>↗</span>

                    <input
                      id="portfolio"
                      name="portfolio"
                      type="url"
                      value={formData.portfolio}
                      onChange={handleChange}
                      placeholder="https://yourportfolio.com"
                    />
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* EXPERIENCE */}

          <section className="profile-card">
            <div className="profile-card-header">
              <div className="profile-card-title">
                <div className="profile-section-icon">▣</div>

                <div>
                  <h2>Experience</h2>
                  <p>Add your work experience</p>
                </div>
              </div>

              {!showExperienceForm && (
                <button
                  type="button"
                  className="outline-blue-btn"
                  onClick={() => setShowExperienceForm(true)}
                >
                  + Add Experience
                </button>
              )}
            </div>

            {showExperienceForm && (
              <div className="dynamic-editor">
                <div className="editor-title">
                  {editingExperienceIndex !== null
                    ? "Edit Experience"
                    : "Add Experience"}
                </div>

                <div className="profile-fields-grid">
                  <div className="profile-field">
                    <label>Company *</label>
                    <input
                      name="company"
                      value={experienceForm.company}
                      onChange={handleExperienceChange}
                      placeholder="Company name"
                    />
                  </div>

                  <div className="profile-field">
                    <label>Position *</label>
                    <input
                      name="position"
                      value={experienceForm.position}
                      onChange={handleExperienceChange}
                      placeholder="Software Developer"
                    />
                  </div>

                  <div className="profile-field">
                    <label>Location</label>
                    <input
                      name="location"
                      value={experienceForm.location}
                      onChange={handleExperienceChange}
                      placeholder="Bhopal"
                    />
                  </div>

                  <div className="profile-field">
                    <label>Start Date *</label>
                    <input
                      type="date"
                      name="startDate"
                      value={experienceForm.startDate}
                      onChange={handleExperienceChange}
                    />
                  </div>

                  {!experienceForm.isCurrent && (
                    <div className="profile-field">
                      <label>End Date</label>
                      <input
                        type="date"
                        name="endDate"
                        value={experienceForm.endDate}
                        onChange={handleExperienceChange}
                      />
                    </div>
                  )}

                  <div className="experience-checkbox">
                    <label>
                      <input
                        type="checkbox"
                        name="isCurrent"
                        checked={experienceForm.isCurrent}
                        onChange={handleExperienceChange}
                      />
                      I currently work here
                    </label>
                  </div>

                  <div className="profile-field profile-field-full">
                    <label>Description</label>

                    <textarea
                      name="description"
                      rows="4"
                      value={experienceForm.description}
                      onChange={handleExperienceChange}
                      placeholder="Describe your responsibilities and achievements..."
                    />
                  </div>
                </div>

                <div className="editor-actions">
                  <button
                    type="button"
                    className="cancel-editor-btn"
                    onClick={resetExperienceForm}
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    className="save-editor-btn"
                    onClick={handleSaveExperience}
                  >
                    {editingExperienceIndex !== null
                      ? "Update Experience"
                      : "Add Experience"}
                  </button>
                </div>
              </div>
            )}

            <div className="timeline-list">
              {formData.experience.length === 0 && !showExperienceForm && (
                <div className="empty-section">
                  <span>▣</span>
                  <p>No experience added yet.</p>

                  <button
                    type="button"
                    onClick={() => setShowExperienceForm(true)}
                  >
                    Add your first experience
                  </button>
                </div>
              )}

              {formData.experience.map((experience, index) => (
                <div
                  className="timeline-item"
                  key={`${experience.company}-${index}`}
                >
                  <div className="timeline-icon">▣</div>

                  <div className="timeline-content">
                    <div className="timeline-top">
                      <div>
                        <h3>{experience.position}</h3>

                        <strong>{experience.company}</strong>

                        {experience.location && (
                          <span>{experience.location}</span>
                        )}
                      </div>

                      <div className="timeline-actions">
                        <button
                          type="button"
                          onClick={() => handleEditExperience(index)}
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="danger-text"
                          onClick={() => handleRemoveExperience(index)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    <div className="timeline-date">
                      {experience.startDate || "—"}
                      {" — "}
                      {experience.isCurrent
                        ? "Present"
                        : experience.endDate || "—"}
                    </div>

                    {experience.description && <p>{experience.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* EDUCATION */}

          <section className="profile-card">
            <div className="profile-card-header">
              <div className="profile-card-title">
                <div className="profile-section-icon">◈</div>

                <div>
                  <h2>Education</h2>
                  <p>Add your education details</p>
                </div>
              </div>

              {!showEducationForm && (
                <button
                  type="button"
                  className="outline-blue-btn"
                  onClick={() => setShowEducationForm(true)}
                >
                  + Add Education
                </button>
              )}
            </div>

            {showEducationForm && (
              <div className="dynamic-editor">
                <div className="editor-title">
                  {editingEducationIndex !== null
                    ? "Edit Education"
                    : "Add Education"}
                </div>

                <div className="profile-fields-grid">
                  <div className="profile-field">
                    <label>Institution *</label>
                    <input
                      name="institution"
                      value={educationForm.institution}
                      onChange={handleEducationChange}
                      placeholder="University / College"
                    />
                  </div>

                  <div className="profile-field">
                    <label>Degree *</label>
                    <input
                      name="degree"
                      value={educationForm.degree}
                      onChange={handleEducationChange}
                      placeholder="B.Tech"
                    />
                  </div>

                  <div className="profile-field">
                    <label>Field of Study</label>
                    <input
                      name="field"
                      value={educationForm.field}
                      onChange={handleEducationChange}
                      placeholder="Computer Science"
                    />
                  </div>

                  <div className="profile-field">
                    <label>Start Date *</label>
                    <input
                      type="date"
                      name="startDate"
                      value={educationForm.startDate}
                      onChange={handleEducationChange}
                    />
                  </div>

                  <div className="profile-field">
                    <label>End Date</label>
                    <input
                      type="date"
                      name="endDate"
                      value={educationForm.endDate}
                      onChange={handleEducationChange}
                    />
                  </div>

                  <div className="profile-field">
                    <label>Grade</label>
                    <input
                      name="grade"
                      value={educationForm.grade}
                      onChange={handleEducationChange}
                      placeholder="8.5 CGPA"
                    />
                  </div>
                </div>

                <div className="editor-actions">
                  <button
                    type="button"
                    className="cancel-editor-btn"
                    onClick={resetEducationForm}
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    className="save-editor-btn"
                    onClick={handleSaveEducation}
                  >
                    {editingEducationIndex !== null
                      ? "Update Education"
                      : "Add Education"}
                  </button>
                </div>
              </div>
            )}

            <div className="education-list">
              {formData.education.length === 0 && !showEducationForm && (
                <div className="empty-section">
                  <span>◈</span>
                  <p>No education added yet.</p>

                  <button
                    type="button"
                    onClick={() => setShowEducationForm(true)}
                  >
                    Add your education
                  </button>
                </div>
              )}

              {formData.education.map((education, index) => (
                <div
                  className="education-item"
                  key={`${education.institution}-${index}`}
                >
                  <div className="education-icon">◈</div>

                  <div className="education-content">
                    <div className="timeline-top">
                      <div>
                        <h3>{education.degree}</h3>

                        <strong>{education.institution}</strong>

                        {education.field && <span>{education.field}</span>}
                      </div>

                      <div className="timeline-actions">
                        <button
                          type="button"
                          onClick={() => handleEditEducation(index)}
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="danger-text"
                          onClick={() => handleRemoveEducation(index)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    <div className="timeline-date">
                      {education.startDate || "—"}
                      {" — "}
                      {education.endDate || "Present"}
                    </div>

                    {education.grade && (
                      <span className="grade-badge">
                        Grade: {education.grade}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* FORM MESSAGE */}

          {error && (
            <div className="profile-message profile-message-error">
              <span>!</span>
              {error}
            </div>
          )}

          {successMessage && (
            <div className="profile-message profile-message-success">
              <span>✓</span>
              {successMessage}
            </div>
          )}

          {/* SAVE */}

          <div className="profile-save-bar">
            <div>
              <strong>
                {hasProfile
                  ? "Keep your profile updated"
                  : "Ready to create your profile?"}
              </strong>

              <span>
                {hasProfile
                  ? "Your latest information will be saved securely."
                  : "You can edit these details anytime later."}
              </span>
            </div>

            <button
              type="submit"
              className="primary-save-btn"
              disabled={isSaving}
            >
              {isSaving
                ? "Saving..."
                : hasProfile
                  ? "✓ Save Changes"
                  : "✓ Create Profile"}
            </button>
          </div>
        </main>

        {/* RIGHT SIDEBAR */}

        <aside className="profile-sidebar">
          <div className="completion-card">
            <div className="completion-heading">
              <div>
                <span>Profile Completion</span>

                <strong>{profile?.profileCompletion ?? 0}%</strong>
              </div>

              <div
                className="completion-circle"
                style={{
                  "--completion": `${profile?.profileCompletion ?? 0}%`,
                }}
              >
                <div>
                  <strong>{profile?.profileCompletion ?? 0}</strong>
                  <span>%</span>
                </div>
              </div>
            </div>

            <div className="completion-progress">
              <div
                style={{
                  width: `${profile?.profileCompletion ?? 0}%`,
                }}
              />
            </div>

            <div className="completion-tip">
              <span>✦</span>

              <p>
                Complete your profile to get better job recommendations and
                improve your chances of getting hired.
              </p>
            </div>
          </div>

          <div className="quick-actions-card">
            <h3>Quick Actions</h3>

            <button
              type="submit"
              className="quick-save-btn"
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "▣  Save Changes"}
            </button>

            <button
              type="button"
              className="quick-outline-btn"
              onClick={() =>
                window.scrollTo({
                  top: 0,
                  behavior: "smooth",
                })
              }
            >
              ↑ Back to Top
            </button>

            {hasProfile && (
              <button
                type="button"
                className="quick-delete-btn"
                onClick={() => setShowDeleteModal(true)}
                disabled={isDeleting}
              >
                ✕ Delete Profile
              </button>
            )}
          </div>

          <div className="profile-help-card">
            <div className="help-icon">?</div>

            <div>
              <strong>Complete your profile</strong>
              <p>
                A complete profile helps HireAI understand your skills and
                career goals.
              </p>
            </div>
          </div>
        </aside>
      </div>

      {showDeleteModal && (
        <div
          className="profile-modal-backdrop"
          onClick={() => setShowDeleteModal(false)}
        >
          <div
            className="profile-delete-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="delete-modal-icon">!</div>

            <h2>Delete your profile?</h2>

            <p>
              This will permanently delete your profile information, including
              your skills, experience, education and social links.
            </p>

            <div className="delete-modal-actions">
              <button
                type="button"
                className="modal-cancel-btn"
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
              >
                Cancel
              </button>

              <button
                type="button"
                className="modal-delete-btn"
                onClick={handleDeleteProfile}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete Profile"}
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
};

export default ProfileForm;
