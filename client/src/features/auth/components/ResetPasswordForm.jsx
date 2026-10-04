import { useState } from "react";
import { Eye, EyeOff, Lock, CheckCircle2, ArrowLeft } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import authApi from "../api/authApi";
import "./ResetPasswordForm.css";

const ResetPasswordForm = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");

    if (!token) {
      setStatus("error");
      setMessage("Password reset link is invalid or missing.");
      return;
    }

    if (!password || !confirmPassword) {
      setStatus("error");
      setMessage("Please enter and confirm your new password.");
      return;
    }

    if (password.length < 8) {
      setStatus("error");
      setMessage("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setStatus("error");
      setMessage("Passwords do not match.");
      return;
    }

    try {
      setStatus("loading");

      const response = await authApi.resetPassword(token, password);

      setStatus("success");
      setMessage(
        response?.message ||
          "Password reset successfully. Redirecting to login...",
      );

      setTimeout(() => {
        navigate("/login", {
          replace: true,
          state: {
            message: "Password reset successfully. Please login.",
          },
        });
      }, 1500);
    } catch (error) {
      setStatus("error");

      setMessage(
        error?.response?.data?.message ||
          "This password reset link is invalid or has expired.",
      );
    }
  };

  if (!token) {
    return (
      <div className="reset-password-form">
        <div className="reset-password-icon error-icon">
          <Lock size={24} />
        </div>

        <div className="reset-password-header">
          <h1>Invalid Reset Link</h1>

          <p>
            This password reset link is missing or invalid. Please request a new
            password reset link.
          </p>
        </div>

        <Link to="/forgot-password" className="reset-password-primary-link">
          Request New Reset Link
        </Link>

        <Link to="/login" className="back-to-login">
          <ArrowLeft size={16} />
          Back to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="reset-password-form">
      <div className="reset-password-icon">
        <Lock size={24} />
      </div>

      <div className="reset-password-header">
        <h1>Reset your password</h1>

        <p>
          Create a new password for your HireAI account. Make sure it is at
          least 8 characters long.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-field">
          <label htmlFor="new-password">New password</label>

          <div className="password-input-wrapper">
            <Lock size={18} />

            <input
              id="new-password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter new password"
              autoComplete="new-password"
              disabled={status === "loading"}
            />

            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword((current) => !current)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div className="form-field">
          <label htmlFor="confirm-password">Confirm new password</label>

          <div className="password-input-wrapper">
            <Lock size={18} />

            <input
              id="confirm-password"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="Confirm new password"
              autoComplete="new-password"
              disabled={status === "loading"}
            />

            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowConfirmPassword((current) => !current)}
              aria-label={
                showConfirmPassword
                  ? "Hide confirm password"
                  : "Show confirm password"
              }
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {message && (
          <div
            className={`reset-password-message ${
              status === "success" ? "success" : "error"
            }`}
          >
            {status === "success" && <CheckCircle2 size={18} />}
            <span>{message}</span>
          </div>
        )}

        <button
          type="submit"
          className="reset-password-button"
          disabled={status === "loading"}
        >
          {status === "loading" ? "Resetting Password..." : "Reset Password"}
        </button>
      </form>

      <Link to="/login" className="back-to-login">
        <ArrowLeft size={16} />
        Back to Login
      </Link>
    </div>
  );
};

export default ResetPasswordForm;
