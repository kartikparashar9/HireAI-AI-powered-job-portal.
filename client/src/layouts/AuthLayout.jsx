import { Link, Outlet } from "react-router-dom";
import { BriefcaseBusiness, Sparkles } from "lucide-react";
import "./AuthLayout.css";

const AuthLayout = () => {
  return (
    <div className="auth-layout">
      <div className="auth-brand-panel">
        <Link to="/" className="auth-brand">
          <span>
            <BriefcaseBusiness size={20} />
          </span>
          HireAI
        </Link>

        <div className="auth-brand-content">
          <div className="auth-ai-icon">
            <Sparkles size={26} />
          </div>

          <h1>
            Better Jobs.
            <br />
            <span>Brighter Future.</span>
          </h1>

          <p>
            Find opportunities, get AI-powered career guidance and build the
            career you want.
          </p>

          <div className="auth-benefits">
            <div>
              <span>01</span>
              AI-powered job matching
            </div>

            <div>
              <span>02</span>
              Resume analysis & guidance
            </div>

            <div>
              <span>03</span>
              Interview preparation
            </div>
          </div>
        </div>
      </div>

      <div className="auth-form-panel">
        <div className="auth-mobile-brand">
          <Link to="/" className="auth-brand">
            <span>
              <BriefcaseBusiness size={18} />
            </span>
            HireAI
          </Link>
        </div>

        <div className="auth-form-container">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;