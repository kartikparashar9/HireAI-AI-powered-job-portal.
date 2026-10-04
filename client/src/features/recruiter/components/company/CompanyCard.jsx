const CompanyCard = ({ company, onEdit, onDelete, isSubmitting }) => {
  if (!company) {
    return null;
  }

  return (
    <div className="recruiter-company-card">
      <div className="recruiter-company-header">
        <div className="recruiter-company-logo">
          {company.logo ? (
            <img src={company.logo} alt={company.name || "Company"} />
          ) : (
            <span>{(company.name || "C").charAt(0).toUpperCase()}</span>
          )}
        </div>

        <div className="recruiter-company-heading">
          <h2>{company.name || "Unnamed Company"}</h2>

          {company.industry && <p>{company.industry}</p>}
        </div>

        <div className="recruiter-company-actions">
          <button
            type="button"
            className="recruiter-edit-button"
            onClick={onEdit}
            disabled={isSubmitting}
          >
            Edit
          </button>

          <button
            type="button"
            className="recruiter-delete-button"
            onClick={onDelete}
            disabled={isSubmitting}
          >
            Delete
          </button>
        </div>
      </div>

      {company.description && (
        <div className="recruiter-company-section">
          <span>Description</span>
          <p>{company.description}</p>
        </div>
      )}

      <div className="recruiter-company-details">
        {company.location && (
          <div>
            <span>Location</span>
            <strong>{company.location}</strong>
          </div>
        )}

        {company.companySize && (
          <div>
            <span>Company Size</span>
            <strong>{company.companySize}</strong>
          </div>
        )}

        {company.website && (
          <div>
            <span>Website</span>
            <a href={company.website} target="_blank" rel="noreferrer">
              Visit Website
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyCard;
