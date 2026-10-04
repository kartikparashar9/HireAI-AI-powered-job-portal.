const formatDate = (value) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const CompanyTable = ({
  companies = [],
  actionLoadingId,
  onView,
  onDelete,
}) => {
  if (!companies.length) {
    return (
      <div className="admin-empty-state">
        <h3>No companies found</h3>
        <p>Try changing your search or industry filter.</p>
      </div>
    );
  }

  return (
    <div className="admin-table-wrapper">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Company</th>
            <th>Industry</th>
            <th>Size</th>
            <th>Location</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {companies.map((company) => {
            const recruiter =
              typeof company.recruiter === "object" ? company.recruiter : null;

            return (
              <tr key={company._id}>
                <td>
                  <div className="admin-company-cell">
                    {company.logo ? (
                      <img
                        src={company.logo}
                        alt=""
                        className="admin-company-logo"
                      />
                    ) : (
                      <div className="admin-company-logo admin-company-logo-fallback">
                        {(company.name || "C").charAt(0).toUpperCase()}
                      </div>
                    )}

                    <div>
                      <strong>{company.name || "Unnamed Company"}</strong>

                      <span>{company.website || "No website"}</span>
                    </div>
                  </div>
                </td>

                <td>{company.industry || "—"}</td>

                <td>{company.companySize || "—"}</td>

                <td>{company.location || "—"}</td>

                <td>{formatDate(company.createdAt)}</td>

                <td>
                  <div className="admin-table-actions">
                    <button
                      type="button"
                      className="admin-small-button"
                      onClick={() => onView(company._id)}
                    >
                      View
                    </button>

                    <button
                      type="button"
                      className="admin-small-danger-button"
                      disabled={actionLoadingId === company._id}
                      onClick={() => onDelete(company)}
                    >
                      {actionLoadingId === company._id ? "..." : "Delete"}
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default CompanyTable;
