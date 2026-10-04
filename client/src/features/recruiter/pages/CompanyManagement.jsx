import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchMyCompany,
  createCompany,
  updateCompany,
  deleteCompany,
  clearRecruiterError,
  clearRecruiterSuccess,
} from "../recruiterSlice";

import CompanyCard from "../components/company/CompanyCard";
import CompanyForm from "../components/company/CompanyForm";

import "../recruiter.css";

const CompanyManagement = () => {
  const dispatch = useDispatch();

  const [isEditing, setIsEditing] = useState(false);

  const {
    company,
    companyLoading,
    companyError,
    isSubmitting,
    successMessage,
  } = useSelector((state) => state.recruiter);

  useEffect(() => {
    dispatch(fetchMyCompany());

    return () => {
      dispatch(clearRecruiterError());
      dispatch(clearRecruiterSuccess());
    };
  }, [dispatch]);

  // ==========================================
  // CREATE COMPANY
  // ==========================================

  const handleCreateCompany = async (companyData) => {
    const result = await dispatch(createCompany(companyData));

    if (!result.error) {
      setIsEditing(false);
    }

    return result;
  };

  // ==========================================
  // UPDATE COMPANY
  // ==========================================

  const handleUpdateCompany = async (companyData) => {
    if (!company?._id) {
      return;
    }

    const result = await dispatch(
      updateCompany({
        companyId: company._id,
        companyData,
      }),
    );

    if (!result.error) {
      setIsEditing(false);
    }

    return result;
  };

  // ==========================================
  // DELETE COMPANY
  // ==========================================

  const handleDeleteCompany = async () => {
    if (!company?._id || isSubmitting) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete your company?",
    );

    if (!confirmed) {
      return;
    }

    await dispatch(deleteCompany(company._id));

    setIsEditing(false);
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (companyLoading) {
    return (
      <div className="recruiter-page">
        <div className="recruiter-loading">Loading company...</div>
      </div>
    );
  }

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div className="recruiter-page">
      <div className="recruiter-page-header">
        <div>
          <p className="recruiter-page-eyebrow">Recruiter</p>

          <h1>My Company</h1>

          <p>Manage your company information.</p>
        </div>
      </div>

      {/* SUCCESS MESSAGE */}

      {successMessage && (
        <div className="recruiter-success-message">{successMessage}</div>
      )}

      {/* ERROR MESSAGE */}

      {companyError && (
        <div className="recruiter-error-message">{companyError}</div>
      )}

      {/* ==========================================
          EXISTING COMPANY
          ========================================== */}

      {company ? (
        isEditing ? (
          <div className="recruiter-company-create">
            <div className="recruiter-company-create-header">
              <h2>Edit Company</h2>

              <p>Update your company information.</p>
            </div>

            <CompanyForm
              company={company}
              onSubmit={handleUpdateCompany}
              onCancel={() => setIsEditing(false)}
              isSubmitting={isSubmitting}
            />
          </div>
        ) : (
          <CompanyCard
            company={company}
            onEdit={() => setIsEditing(true)}
            onDelete={handleDeleteCompany}
            isSubmitting={isSubmitting}
          />
        )
      ) : (
        /* ==========================================
           NO COMPANY
           ========================================== */

        <div className="recruiter-company-create">
          <div className="recruiter-company-create-header">
            <h2>Create Company</h2>

            <p>Create your company profile before posting jobs.</p>
          </div>

          <CompanyForm
            onSubmit={handleCreateCompany}
            isSubmitting={isSubmitting}
          />
        </div>
      )}
    </div>
  );
};

export default CompanyManagement;
