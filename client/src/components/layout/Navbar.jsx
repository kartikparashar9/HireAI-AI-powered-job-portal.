import {
  Bell,
  BriefcaseBusiness,
  ChevronDown,
  LayoutDashboard,
  LockKeyhole,
  LogOut,
  Menu,
  UserRound,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { logoutUser } from "../../features/auth/authSlice";
import "./Navbar.css";

const navItems = [
  { label: "Home", to: "/" },
  { label: "Jobs", to: "/jobs" },
  { label: "AI Career", href: "/ai-career" },
];

const profileItems = [
  {
    label: "Dashboard",
    to: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Change Password",
    to: "/reset-password",
    icon: LockKeyhole,
  },
];

const getInitials = (name = "") => {
  const words = name.trim().split(/\s+/).filter(Boolean);

  if (words.length === 0) return "U";
  if (words.length === 1) return words[0].slice(0, 1).toUpperCase();

  return `${words[0].slice(0, 1)}${words[words.length - 1].slice(
    0,
    1,
  )}`.toUpperCase();
};

const Avatar = ({ user, size = "normal" }) => {
  const name = user?.name || "User";
  const initials = getInitials(name);

  return user?.avatar ? (
    <img
      src={user.avatar}
      alt={name}
      className={`navbar-avatar navbar-avatar-${size}`}
    />
  ) : (
    <span
      className={`navbar-avatar navbar-avatar-${size} navbar-avatar-initials`}
    >
      {initials}
    </span>
  );
};

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, isAuthenticated } = useSelector((state) => state.auth || {});

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(true);

  const profileRef = useRef(null);

  const userName = user?.name || "User";

  const closeMenus = () => {
    setMobileMenuOpen(false);
    setProfileMenuOpen(false);
  };

  // Close menus on outside click or ESC key
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileMenuOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closeMenus();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Lock body scroll when mobile menu is active
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    closeMenus();
    navigate("/login", { replace: true });
  };

  const handleNavigation = () => {
    closeMenus();
  };

  return (
    <header className="navbar">
      <div className="container navbar-container">
        {/* LOGO */}
        <Link to="/" className="navbar-logo" onClick={handleNavigation}>
          <span className="navbar-logo-icon">
            <BriefcaseBusiness size={20} />
          </span>
          <span className="navbar-logo-text">
            Hire<span className="navbar-logo-highlight">AI</span>
          </span>
        </Link>

        {/* DESKTOP NAVIGATION */}
        <nav className="navbar-navigation" aria-label="Main Navigation">
          {navItems.map((item) =>
            item.to ? (
              <NavLink
                key={item.label}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  `navbar-nav-link ${isActive ? "active" : ""}`
                }
                onClick={handleNavigation}
              >
                {item.label}
              </NavLink>
            ) : (
              <a
                key={item.label}
                href={item.href}
                className="navbar-nav-link"
                onClick={handleNavigation}
              >
                {item.label}
              </a>
            ),
          )}
        </nav>

        {/* DESKTOP ACTIONS */}
        <div className="navbar-actions">
          {isAuthenticated ? (
            <>
              {/* NOTIFICATION BUTTON */}
              <button
                type="button"
                className="navbar-notification"
                aria-label="Notifications"
                onClick={() => {
                  setHasUnreadNotifications(false);
                  navigate("/notifications");
                }}
              >
                <Bell size={19} />

                {hasUnreadNotifications && (
                  <span
                    className="navbar-notification-dot"
                    title="New notifications"
                  />
                )}
              </button>

              {/* PROFILE DROPDOWN TRIGGER */}
              <div className="navbar-profile" ref={profileRef}>
                <button
                  type="button"
                  className={`navbar-profile-trigger ${
                    profileMenuOpen ? "is-active" : ""
                  }`}
                  onClick={() => setProfileMenuOpen((prev) => !prev)}
                  aria-expanded={profileMenuOpen}
                  aria-haspopup="true"
                  aria-label="Open profile menu"
                >
                  <Avatar user={user} />
                  <span className="navbar-profile-name">{userName}</span>
                  <ChevronDown
                    size={16}
                    className={`navbar-profile-chevron ${
                      profileMenuOpen ? "navbar-profile-chevron-open" : ""
                    }`}
                  />
                </button>

                {/* PROFILE DROPDOWN MENU */}
                {profileMenuOpen && (
                  <div className="navbar-dropdown">
                    <div className="navbar-dropdown-header">
                      <Avatar user={user} size="large" />
                      <div className="navbar-dropdown-user">
                        <strong>{userName}</strong>
                        <span>{user?.email || "No email available"}</span>
                      </div>
                    </div>

                    <div className="navbar-dropdown-divider" />

                    <div className="navbar-dropdown-links">
                      {profileItems.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.label}
                            to={item.to}
                            onClick={handleNavigation}
                            className="navbar-dropdown-item"
                          >
                            <Icon size={17} />
                            <span>{item.label}</span>
                          </Link>
                        );
                      })}
                    </div>

                    <div className="navbar-dropdown-divider" />

                    <button
                      type="button"
                      className="navbar-dropdown-item navbar-dropdown-logout"
                      onClick={handleLogout}
                    >
                      <LogOut size={17} />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-login">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary navbar-signup">
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* MOBILE MENU TOGGLE BUTTON */}
        <button
          type="button"
          className="navbar-mobile-button"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          aria-label="Toggle navigation"
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* MOBILE MENU OVERLAY & DRAWER */}
      {mobileMenuOpen && (
        <>
          <div
            className="navbar-mobile-backdrop"
            onClick={closeMenus}
            aria-hidden="true"
          />

          <div className="navbar-mobile-menu">
            <nav
              className="navbar-mobile-navigation"
              aria-label="Mobile Navigation"
            >
              {navItems.map((item) =>
                item.to ? (
                  <NavLink
                    key={item.label}
                    to={item.to}
                    end={item.to === "/"}
                    className={({ isActive }) =>
                      `navbar-mobile-link ${isActive ? "active" : ""}`
                    }
                    onClick={handleNavigation}
                  >
                    {item.label}
                  </NavLink>
                ) : (
                  <a
                    key={item.label}
                    href={item.href}
                    className="navbar-mobile-link"
                    onClick={handleNavigation}
                  >
                    {item.label}
                  </a>
                ),
              )}
            </nav>

            {isAuthenticated ? (
              <div className="navbar-mobile-account">
                <div className="navbar-mobile-user">
                  <Avatar user={user} size="large" />
                  <div>
                    <strong>{userName}</strong>
                    <span>{user?.email || ""}</span>
                  </div>
                </div>

                <div className="navbar-mobile-account-links">
                  {profileItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.label}
                        to={item.to}
                        onClick={handleNavigation}
                      >
                        <Icon size={17} />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}

                  <button type="button" onClick={handleLogout}>
                    <LogOut size={17} />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="navbar-mobile-auth">
                <Link
                  to="/login"
                  className="btn btn-outline"
                  onClick={handleNavigation}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn btn-primary"
                  onClick={handleNavigation}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </>
      )}
    </header>
  );
};

export default Navbar;
