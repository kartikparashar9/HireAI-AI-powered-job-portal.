import { useEffect, useState } from "react";

const createInitialFormData = () => ({
  applicationId: "",
  jobId: "",
  candidateId: "",
  type: "VIDEO",
  scheduledAt: "",
  durationMinutes: 30,
  meetingLink: "",
  location: "",
  notes: "",
});

const InterviewForm = ({
  interview = null,
  applications = [],
  onSubmit,
  onCancel,
  isSubmitting = false,
}) => {
  const [formData, setFormData] = useState(createInitialFormData);

  const isEditMode = Boolean(interview);

  useEffect(() => {
    if (!interview) {
      setFormData(createInitialFormData());
      return;
    }

    setFormData({
      applicationId: interview.application?._id || interview.application || "",
      jobId: interview.job?._id || interview.job || "",
      candidateId: interview.candidate?._id || interview.candidate || "",
      type: interview.type || "VIDEO",
      scheduledAt: interview.scheduledAt
        ? new Date(interview.scheduledAt).toISOString().slice(0, 16)
        : "",
      durationMinutes: interview.durationMinutes || 30,
      meetingLink: interview.meetingLink || "",
      location: interview.location || "",
      notes: interview.notes || "",
    });
  }, [interview]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleApplicationChange = (event) => {
    const applicationId = event.target.value;

    const selectedApplication = applications.find(
      (application) => application._id === applicationId,
    );

    setFormData((previous) => ({
      ...previous,
      applicationId,
      jobId: selectedApplication?.job?._id || selectedApplication?.job || "",
      candidateId:
        selectedApplication?.candidate?._id ||
        selectedApplication?.candidate ||
        "",
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      application: formData.applicationId,
      type: formData.type,
      scheduledAt: formData.scheduledAt,
      durationMinutes: Number(formData.durationMinutes),
      meetingLink: formData.meetingLink.trim(),
      location: formData.location.trim(),
      notes: formData.notes.trim(),
    };

    await onSubmit(payload);
  };

  return (
    <form className="recruiter-interview-form" onSubmit={handleSubmit}>
      {!isEditMode && (
        <div className="recruiter-form-group">
          <label htmlFor="interview-application">Candidate Application</label>

          <select
            id="interview-application"
            name="applicationId"
            value={formData.applicationId}
            onChange={handleApplicationChange}
            required
          >
            <option value="">Select an application</option>

            {applications.map((application) => (
              <option key={application._id} value={application._id}>
                {application.candidate?.name || "Candidate"} —{" "}
                {application.job?.title || "Job"}
              </option>
            ))}
          </select>
        </div>
      )}

      {isEditMode && (
        <div className="recruiter-selected-interview-candidate">
          <span>Candidate</span>

          <strong>{interview?.candidate?.name || "Candidate"}</strong>

          <small>{interview?.job?.title || "Job"}</small>
        </div>
      )}

      <div className="recruiter-interview-form-grid">
        <div className="recruiter-form-group">
          <label htmlFor="interview-type">Interview Type</label>

          <select
            id="interview-type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
          >
            <option value="VIDEO">Video Interview</option>

            <option value="PHONE">Phone Interview</option>

            <option value="IN_PERSON">Onsite Interview</option>

            <option value="TECHNICAL">Technical Interview</option>

            <option value="BEHAVIORAL">Behavioral Interview</option>
          </select>
        </div>

        <div className="recruiter-form-group">
          <label htmlFor="interview-duration">Duration</label>

          <select
            id="interview-duration"
            name="durationMinutes"
            value={formData.durationMinutes}
            onChange={handleChange}
          >
            <option value={15}>15 minutes</option>
            <option value={30}>30 minutes</option>
            <option value={45}>45 minutes</option>
            <option value={60}>60 minutes</option>
            <option value={90}>90 minutes</option>
            <option value={120}>120 minutes</option>
          </select>
        </div>
      </div>

      <div className="recruiter-form-group">
        <label htmlFor="interview-scheduled-at">Scheduled Date & Time</label>

        <input
          id="interview-scheduled-at"
          name="scheduledAt"
          type="datetime-local"
          value={formData.scheduledAt}
          onChange={handleChange}
          required
        />
      </div>

      {(formData.type === "VIDEO" || formData.type === "PHONE") && (
        <div className="recruiter-form-group">
          <label htmlFor="interview-meeting-link">Meeting / Call Link</label>

          <input
            id="interview-meeting-link"
            name="meetingLink"
            type="url"
            value={formData.meetingLink}
            onChange={handleChange}
            placeholder="https://meet.google.com/..."
          />
        </div>
      )}

      {formData.type === "IN_PERSON" && (
        <div className="recruiter-form-group">
          <label htmlFor="interview-location">Interview Location</label>

          <input
            id="interview-location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Office address / meeting room"
          />
        </div>
      )}

      <div className="recruiter-form-group">
        <label htmlFor="interview-notes">Notes</label>

        <textarea
          id="interview-notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={5}
          placeholder="Add interview instructions or notes..."
        />
      </div>

      <div className="recruiter-form-actions">
        <button
          type="submit"
          className="recruiter-save-button"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? isEditMode
              ? "Updating..."
              : "Scheduling..."
            : isEditMode
              ? "Update Interview"
              : "Schedule Interview"}
        </button>

        {onCancel && (
          <button
            type="button"
            className="recruiter-cancel-button"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default InterviewForm;
