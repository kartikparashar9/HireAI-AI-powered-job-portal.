import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { GoogleLogin } from "@react-oauth/google";

import { googleLoginUser, loginUser } from "../authSlice";

const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isLoading, error } = useSelector((state) => state.auth);

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const result = await dispatch(loginUser(formData));

    if (loginUser.fulfilled.match(result)) {
      const role =
        result.payload?.data?.user?.role || result.payload?.user?.role;

      if (role === "RECRUITER") {
        navigate("/recruiter/dashboard", { replace: true });
      } else if (role === "ADMIN") {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    const credential = credentialResponse?.credential;

    if (!credential) {
      return;
    }

    const result = await dispatch(googleLoginUser(credential));

    if (googleLoginUser.fulfilled.match(result)) {
      const role =
        result.payload?.data?.user?.role || result.payload?.user?.role;

      if (role === "RECRUITER") {
        navigate("/recruiter/dashboard", { replace: true });
      } else if (role === "ADMIN") {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    }
  };

  const handleGoogleError = () => {
    console.error("Google Login Failed");
  };

  return (
    <div className="auth-form">
      <div className="auth-heading">
        <span className="auth-eyebrow">Welcome back</span>

        <h2>Sign In</h2>

        <p>Sign in to your account and continue your career journey.</p>
      </div>

      {error && <div className="auth-error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <label className="form-label">
          Email Address
          <div className="input-wrapper">
            <Mail size={17} />

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
        </label>

        <label className="form-label">
          Password
          <div className="input-wrapper">
            <LockKeyhole size={17} />

            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword((previous) => !previous)}
            >
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
        </label>

        <div className="form-options">
          <label>
            <input type="checkbox" />
            Remember me
          </label>

          <Link to="/forgot-password">Forgot password?</Link>
        </div>

        <button
          type="submit"
          className="btn btn-primary auth-submit"
          disabled={isLoading}
        >
          {isLoading ? "Signing In..." : "Sign In"}
        </button>
      </form>

      <div className="auth-divider">
        <span>or</span>
      </div>

      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={handleGoogleError}
        useOneTap={false}
      />

      <p className="auth-bottom-text">
        Don't have an account? <Link to="/register">Sign Up</Link>
      </p>
    </div>
  );
};

export default LoginForm;
