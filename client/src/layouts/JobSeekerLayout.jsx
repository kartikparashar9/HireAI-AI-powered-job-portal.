import React, { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";

import JobSeekerSidebar from "../components/layout/JobSeekerSidebar";
import JobSeekerTopbar from "../components/layout/JobSeekerTopbar";

import "./JobSeekerLayout.css";

const JobSeekerLayout = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const location = useLocation();

  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [location.pathname]);

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen((previous) => !previous);
  };

  const closeMobileSidebar = () => {
    setIsMobileSidebarOpen(false);
  };

  return (
    <div className="job-seeker-layout">
      {/* Mobile sidebar backdrop */}
      {isMobileSidebarOpen && (
        <div
          className="sidebar-backdrop"
          onClick={closeMobileSidebar}
          role="presentation"
        />
      )}

      {/* Sidebar */}
      <JobSeekerSidebar
        isOpen={isMobileSidebarOpen}
        onClose={closeMobileSidebar}
      />

      {/* Main application */}
      <div className="job-seeker-main">
        <JobSeekerTopbar onToggleSidebar={toggleMobileSidebar} />

        <main className="job-seeker-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default JobSeekerLayout;
