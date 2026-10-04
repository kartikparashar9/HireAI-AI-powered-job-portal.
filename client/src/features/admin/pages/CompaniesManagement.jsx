import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  clearAdminError,
  clearSelectedCompany,
  deleteCompany,
  fetchCompanies,
  fetchCompanyById,
} from "../adminSlice";

import CompanyTable from "../components/CompanyTable";
import ConfirmModal from "../components/ConfirmModal";
import Pagination from "../components/Pagination";

import "../styles/admin.css";

const CompaniesManagement = () => {
  const dispatch = useDispatch();

  const {
    companies,
    companiesPagination,
    companiesLoading,
    selectedCompany,
    error,
    actionLoadingId,
  } = useSelector((state) => state.admin);

  const [search, setSearch] = useState("");

  const [industry, setIndustry] = useState("");

  const [page, setPage] = useState(1);

  const [confirm, setConfirm] = useState(null);

  useEffect(() => {
    dispatch(
      fetchCompanies({
        page,
        limit: 20,
        search: search.trim(),
        industry,
      }),
    );
  }, [dispatch, page, search, industry]);

  const handleDelete = (company) => {
    setConfirm({
      company,
      title: "Delete company?",
      message: `This permanently deletes ${
        company.name || "this company"
      }. The recruiter account will not be deleted.`,
    });
  };

  const handleConfirmDelete = async () => {
    if (!confirm?.company) {
      return;
    }

    await dispatch(deleteCompany(confirm.company._id));

    setConfirm(null);
  };

  return (
    <div className="admin-page">
      <div className="admin-page-heading">
        <div>
          <span className="admin-eyebrow">Management</span>

          <h1>Companies</h1>

          <p>Review registered companies and recruiter ownership.</p>
        </div>
      </div>

      {error && (
        <div className="admin-alert error">
          {error}

          <button type="button" onClick={() => dispatch(clearAdminError())}>
            ×
          </button>
        </div>
      )}

      <section className="admin-section-card">
        <div className="admin-filter-bar">
          <input
            className="admin-input"
            placeholder="Search companies..."
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);

              setPage(1);
            }}
          />

          <input
            className="admin-input"
            placeholder="Filter by industry..."
            value={industry}
            onChange={(event) => {
              setIndustry(event.target.value);

              setPage(1);
            }}
          />
        </div>

        {companiesLoading ? (
          <div className="admin-loading">Loading companies...</div>
        ) : (
          <CompanyTable
            companies={companies}
            actionLoadingId={actionLoadingId}
            onView={(companyId) => dispatch(fetchCompanyById(companyId))}
            onDelete={handleDelete}
          />
        )}

        <Pagination
          page={companiesPagination?.page || page}
          totalPages={companiesPagination?.totalPages || 1}
          disabled={companiesLoading}
          onPageChange={setPage}
        />
      </section>

      {selectedCompany && (
        <div className="admin-details-panel">
          <div className="admin-details-header">
            <div>
              <span className="admin-eyebrow">Company Details</span>

              <h2>{selectedCompany.name || "Company"}</h2>
            </div>

            <button
              type="button"
              className="admin-icon-button"
              onClick={() => dispatch(clearSelectedCompany())}
            >
              ×
            </button>
          </div>

          <div className="admin-details-grid">
            <div>
              <span>Industry</span>

              <strong>{selectedCompany.industry || "—"}</strong>
            </div>

            <div>
              <span>Company Size</span>

              <strong>{selectedCompany.companySize || "—"}</strong>
            </div>

            <div>
              <span>Location</span>

              <strong>{selectedCompany.location || "—"}</strong>
            </div>

            <div>
              <span>Website</span>

              <strong>{selectedCompany.website || "—"}</strong>
            </div>

            <div className="admin-detail-wide">
              <span>Description</span>

              <strong>{selectedCompany.description || "—"}</strong>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        open={Boolean(confirm)}
        title={confirm?.title}
        message={confirm?.message}
        danger
        confirmText="Delete"
        loading={Boolean(actionLoadingId)}
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirm(null)}
      />
    </div>
  );
};

export default CompaniesManagement;
