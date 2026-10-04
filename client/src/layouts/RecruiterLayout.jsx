import { useState } from "react";
import { Outlet } from "react-router-dom";

import RecruiterSidebar from "../components/layout/RecruiterSidebar";
import RecruiterTopbar from "../components/layout/RecruiterTopbar";

import "./RecruiterLayout.css";

const RecruiterLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };

  const handleToggleSidebar = () => {
    setSidebarOpen((previous) => !previous);
  };

  return (
    <div className="recruiter-layout">
      <RecruiterSidebar isOpen={sidebarOpen} onClose={handleCloseSidebar} />

      {sidebarOpen && (
        <button
          type="button"
          className="recruiter-sidebar-backdrop"
          aria-label="Close navigation"
          onClick={handleCloseSidebar}
        />
      )}

      <div className="recruiter-main">
        <RecruiterTopbar onMenuClick={handleToggleSidebar} />

        <main className="recruiter-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default RecruiterLayout;
