import { useEffect, useState } from "react";

const initialFormData = {
  name: "",
  logo: "",
  description: "",
  website: "",
  industry: "",
  companySize: "",
  location: "",
};

const CompanyForm = ({ company = null, onSubmit, onCancel, isSubmitting }) => {
  const [formData, setFormData] = useState(initialFormData);

  const isEditMode = Boolean(company);

  useEffect(() => {
    if (company) {
      setFormData({
        name: company.name || "",
        logo: company.logo || "",
        description: company.description || "",
        website: company.website || "",
        industry: company.industry || "",
        companySize: company.companySize || "",
        location: company.location || "",
      });

      return;
    }

    setFormData(initialFormData);
  }, [company]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    await onSubmit({
      ...formData,
      name: formData.name.trim(),
      logo: formData.logo.trim() || null,
      description: formData.description.trim(),
      website: formData.website.trim(),
      industry: formData.industry.trim(),
      companySize: formData.companySize.trim(),
      location: formData.location.trim(),
    });
  };

  return (
    <form className="recruiter-company-form" onSubmit={handleSubmit}>
      <div className="recruiter-form-group">
        <label htmlFor="company-name">Company Name</label>

        <input
          id="company-name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          minLength={2}
        />
      </div>

      <div className="recruiter-form-group">
        <label htmlFor="company-logo">Logo URL</label>

        <input
          id="company-logo"
          name="logo"
          type="url"
          value={formData.logo}
          onChange={handleChange}
          placeholder="https://..."
        />
      </div>

      <div className="recruiter-form-group">
        <label htmlFor="company-description">Description</label>

        <textarea
          id="company-description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={5}
        />
      </div>

      <div className="recruiter-form-grid">
        <div className="recruiter-form-group">
          <label htmlFor="company-website">Website</label>

          <input
            id="company-website"
            name="website"
            type="url"
            value={formData.website}
            onChange={handleChange}
            placeholder="https://..."
          />
        </div>

        <div className="recruiter-form-group">
          <label htmlFor="company-industry">Industry</label>

          <input
            id="company-industry"
            name="industry"
            value={formData.industry}
            onChange={handleChange}
          />
        </div>

        <div className="recruiter-form-group">
          <label htmlFor="company-size">Company Size</label>

          <input
            id="company-size"
            name="companySize"
            value={formData.companySize}
            onChange={handleChange}
            placeholder="e.g. 51-200"
          />
        </div>

        <div className="recruiter-form-group">
          <label htmlFor="company-location">Location</label>

          <input
            id="company-location"
            name="location"
            value={formData.location}
            onChange={handleChange}
          />
        </div>
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
              : "Creating..."
            : isEditMode
              ? "Update Company"
              : "Create Company"}
        </button>

        {isEditMode && (
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

export default CompanyForm;
