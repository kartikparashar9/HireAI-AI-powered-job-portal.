import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  fetchRecruiterProfile,
  fetchMyCompany,
  fetchMyJobs,
  fetchMyInterviews,
  fetchJobApplications,
  clearRecruiterError,
  clearRecruiterSuccess,
} from "../recruiterSlice";

import DashboardStatCard from "../components/dashboard/DashboardStatCard";
import ApplicationStatusChart from "../components/dashboard/ApplicationStatusChart";
import RecentJobs from "../components/dashboard/RecentJobs";
import RecentApplicants from "../components/dashboard/RecentApplicants";
import UpcomingInterviews from "../components/dashboard/UpcomingInterviews";

import "../recruiter.css";

const getPayloadData = (payload) => {
  if (payload?.data !== undefined) {
    return payload.data;
  }

  return payload;
};

const normalizeArray = (value) => {
  if (Array.isArray(value)) {
    return value;
  }

  if (Array.isArray(value?.jobs)) {
    return value.jobs;
  }

  if (Array.isArray(value?.applications)) {
    return value.applications;
  }

  if (Array.isArray(value?.interviews)) {
    return value.interviews;
  }

  return [];
};

const RecruiterDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [dashboardApplications, setDashboardApplications] = useState([]);

  const [applicationsLoading, setApplicationsLoading] = useState(false);

  const {
    profile,
    company,
    jobs,
    interviews,

    profileLoading,
    companyLoading,
    jobsLoading,
    interviewsLoading,

    profileError,
    companyError,
    jobsError,
    interviewsError,
  } = useSelector((state) => state.recruiter);

  useEffect(() => {
    dispatch(fetchRecruiterProfile());
    dispatch(fetchMyCompany());
    dispatch(fetchMyJobs());
    dispatch(fetchMyInterviews());

    return () => {
      dispatch(clearRecruiterError());
      dispatch(clearRecruiterSuccess());
    };
  }, [dispatch]);

  useEffect(() => {
    const loadApplications = async () => {
      if (!Array.isArray(jobs) || jobs.length === 0) {
        setDashboardApplications([]);
        return;
      }

      setApplicationsLoading(true);

      try {
        const results = await Promise.all(
          jobs.map((job) => dispatch(fetchJobApplications(job._id))),
        );

        const allApplications = [];

        results.forEach((result) => {
          if (result?.error) {
            return;
          }

          const payload = getPayloadData(result?.payload);

          const applications = normalizeArray(payload);

          if (applications.length > 0) {
            allApplications.push(...applications);
          }
        });

        const uniqueApplications = Array.from(
          new Map(
            allApplications.map((application) => [
              application._id,
              application,
            ]),
          ).values(),
        );

        setDashboardApplications(uniqueApplications);
      } finally {
        setApplicationsLoading(false);
      }
    };

    loadApplications();
  }, [dispatch, jobs]);

  const safeJobs = Array.isArray(jobs) ? jobs : [];

  const safeInterviews = Array.isArray(interviews) ? interviews : [];

  const safeApplications = Array.isArray(dashboardApplications)
    ? dashboardApplications
    : [];

  const dashboardStats = useMemo(() => {
    const totalJobs = safeJobs.length;

    const openJobs = safeJobs.filter(
      (job) => String(job?.status || "").toUpperCase() === "OPEN",
    ).length;

    const upcomingInterviews = safeInterviews.filter((interview) => {
      const scheduledAt = new Date(interview?.scheduledAt);

      return (
        interview?.status === "SCHEDULED" &&
        !Number.isNaN(scheduledAt.getTime()) &&
        scheduledAt >= new Date()
      );
    }).length;

    return {
      totalJobs,
      openJobs,
      totalApplicants: safeApplications.length,
      upcomingInterviews,
    };
  }, [safeJobs, safeApplications, safeInterviews]);

  const isLoading =
    profileLoading || companyLoading || jobsLoading || interviewsLoading;

  const dashboardError =
    profileError || companyError || jobsError || interviewsError;

  const recruiterName = profile?.name || "Recruiter";

  const companyName = company?.name || "Your Company";

  const hasCompany = Boolean(company);

  if (isLoading) {
    return (
      <div className="recruiter-page">
        <div className="recruiter-dashboard-loading">
          <div className="recruiter-loading-spinner" />
          <h2>Loading dashboard...</h2>
          <p>Fetching your recruitment data.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="recruiter-page recruiter-dashboard-page">
      {dashboardError && (
        <div className="recruiter-error-message recruiter-dashboard-error">
          {dashboardError}
        </div>
      )}

      {/* HEADER */}
      <div className="recruiter-dashboard-header">
        <div>
          <p className="recruiter-page-eyebrow">Recruiter Dashboard</p>

          <h1>Welcome back, {recruiterName}</h1>

          <p>
            Manage your hiring pipeline, candidates and interviews from one
            place.
          </p>
        </div>

        <div className="recruiter-dashboard-header-actions">
          <button
            type="button"
            className="recruiter-secondary-button"
            onClick={() => navigate("/recruiter/profile")}
          >
            My Profile
          </button>

          <button
            type="button"
            className="recruiter-primary-button"
            onClick={() => navigate("/recruiter/jobs")}
          >
            + Create Job
          </button>
        </div>
      </div>

      {/* COMPANY */}
      <div className="recruiter-dashboard-company">
        <div className="recruiter-dashboard-company-logo">
          {company?.logo ? (
            <img src={company.logo} alt={companyName} />
          ) : (
            <span>{companyName.charAt(0).toUpperCase()}</span>
          )}
        </div>

        <div className="recruiter-dashboard-company-info">
          <span>Your company</span>

          <strong>{companyName}</strong>

          {company?.industry && <small>{company.industry}</small>}
        </div>

        <div className="recruiter-dashboard-company-action">
          <button
            type="button"
            className="recruiter-text-button"
            onClick={() => navigate("/recruiter/company")}
          >
            {hasCompany ? "Manage Company" : "Create Company"}
          </button>
        </div>
      </div>

      {/* KPI */}
      <section className="recruiter-dashboard-stats">
        <DashboardStatCard
          title="Total Jobs"
          value={dashboardStats.totalJobs}
          subtitle="All your job postings"
          icon="💼"
        />

        <DashboardStatCard
          title="Open Jobs"
          value={dashboardStats.openJobs}
          subtitle="Currently accepting applications"
          icon="📢"
        />

        <DashboardStatCard
          title="Total Applicants"
          value={dashboardStats.totalApplicants}
          subtitle={
            applicationsLoading ? "Updating..." : "Across your job postings"
          }
          icon="👥"
        />

        <DashboardStatCard
          title="Upcoming Interviews"
          value={dashboardStats.upcomingInterviews}
          subtitle="Scheduled interviews"
          icon="📅"
        />
      </section>

      {/* MAIN GRID */}
      <section className="recruiter-dashboard-grid">
        <ApplicationStatusChart applications={safeApplications} />

        <UpcomingInterviews interviews={safeInterviews} />
      </section>

      <section className="recruiter-dashboard-grid">
        <RecentJobs jobs={safeJobs} />

        <RecentApplicants applications={safeApplications} />
      </section>
    </div>
  );
};

export default RecruiterDashboard;
