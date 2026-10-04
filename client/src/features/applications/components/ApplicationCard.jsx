import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  withdrawApplication,
  selectApplicationWithdrawing,
} from "../applicationSlice";
import ApplicationStatus from "./ApplicationStatus";

const getJob = (application) => application?.job || {};

const getCompany = (job) => {
  if (typeof job.company === "string") {
    return job.company;
  }

  return job.company?.name || "Company";
};

const formatDate = (date) => {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const ApplicationCard = ({ application }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const withdrawing = useSelector(selectApplicationWithdrawing);

  const job = getJob(application);
  const companyName = getCompany(job);

  const applicationId = application?._id;
  const isWithdrawing = withdrawing?.[applicationId] || false;

  const status = application?.status || "APPLIED";

  const canWithdraw = !["REJECTED", "HIRED", "WITHDRAWN"].includes(status);

  const handleView = () => {
    navigate(`/jobseeker/applications/${applicationId}`);
  };

  const handleWithdraw = () => {
    if (!applicationId || isWithdrawing) return;

    const confirmed = window.confirm(
      "Are you sure you want to withdraw this application?",
    );

    if (!confirmed) return;

    dispatch(withdrawApplication(applicationId));
  };

  return (
    <article className="application-card">
      <div className="application-card-top">
        <div className="application-company">
          <div className="application-company-logo">
            {companyName.charAt(0).toUpperCase()}
          </div>

          <div>
            <h3>{job.title || "Job Position"}</h3>

            <p>{companyName}</p>

            {job.location && (
              <span className="application-location">{job.location}</span>
            )}
          </div>
        </div>

        <ApplicationStatus status={status} />
      </div>

      <div className="application-card-meta">
        <div>
          <span>Applied</span>
          <strong>{formatDate(application?.createdAt)}</strong>
        </div>

        <div>
          <span>Application ID</span>
          <strong>
            {applicationId ? `#${applicationId.slice(-6).toUpperCase()}` : "—"}
          </strong>
        </div>
      </div>

      <div className="application-card-actions">
        <button
          type="button"
          className="application-view-button"
          onClick={handleView}
        >
          View Details
        </button>

        {canWithdraw && (
          <button
            type="button"
            className="application-withdraw-button"
            onClick={handleWithdraw}
            disabled={isWithdrawing}
          >
            {isWithdrawing ? "Withdrawing..." : "Withdraw"}
          </button>
        )}
      </div>
    </article>
  );
};

export default ApplicationCard;