import { Link } from "react-router-dom";
import { BriefcaseBusiness, Menu, Search, X } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          <span className="navbar-logo-icon">
            <BriefcaseBusiness size={19} />
          </span>

          <span>HireAI</span>
        </Link>

        <nav className="navbar-links">
          <Link to="/">Home</Link>
          <Link to="/jobs">Jobs</Link>
          <a href="#companies">Companies</a>
          <a href="#ai-career">AI Career</a>
          <a href="#resources">Resources</a>
        </nav>

        <div className="navbar-actions">
          <Link to="/login" className="navbar-login">
            Login
          </Link>

          <Link to="/register" className="btn btn-primary navbar-signup">
            Sign Up
          </Link>
        </div>

        <button
          className="navbar-menu-button"
          type="button"
          aria-label="Toggle navigation"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
        >
          {mobileMenuOpen ? <X size={23} /> : <Menu size={23} />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="mobile-menu">
          <Link to="/" onClick={closeMenu}>
            Home
          </Link>

          <Link to="/jobs" onClick={closeMenu}>
            Jobs
          </Link>

          <a href="#companies" onClick={closeMenu}>
            Companies
          </a>

          <a href="#ai-career" onClick={closeMenu}>
            AI Career
          </a>

          <a href="#resources" onClick={closeMenu}>
            Resources
          </a>

          <div className="mobile-menu-actions">
            <Link to="/login" onClick={closeMenu}>
              Login
            </Link>

            <Link
              to="/register"
              className="btn btn-primary"
              onClick={closeMenu}
            >
              Sign Up
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
