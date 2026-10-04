import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Mail, Send } from "lucide-react";

import authApi from "../api/authApi";
import "./ForgotPasswordForm.css";

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      setStatus("error");
      setMessage("Please enter your email address.");
      return;
    }

    try {
      setStatus("loading");
      setMessage("");

      const response = await authApi.forgotPassword(normalizedEmail);

      setStatus("success");
      setMessage(
        response?.message ||
          "If an account exists with this email, a password reset link has been sent.",
      );
    } catch (error) {
      setStatus("error");
      setMessage(
        error?.response?.data?.message ||
          "Unable to process your request. Please try again.",
      );
    }
  };

  return (
    <div className="forgot-password-form">
      <div className="forgot-password-icon">
        <Mail size={24} />
      </div>

      <div className="forgot-password-header">
        <h1>Forgot your password?</h1>

        <p>
          Enter your registered email address and we'll send you a link to reset
          your password.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-field">
          <label htmlFor="forgot-email">Email address</label>

          <div className="input-wrapper">
            <Mail size={18} />

            <input
              id="forgot-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              disabled={status === "loading"}
            />
          </div>
        </div>

        {message && (
          <div
            className={`forgot-password-message ${
              status === "success" ? "success" : "error"
            }`}
          >
            {message}
          </div>
        )}

        <button
          type="submit"
          className="forgot-password-button"
          disabled={status === "loading"}
        >
          {status === "loading" ? (
            "Sending..."
          ) : (
            <>
              Send Reset Link
              <Send size={17} />
            </>
          )}
        </button>
      </form>

      <Link to="/login" className="back-to-login">
        <ArrowLeft size={16} />
        Back to Login
      </Link>
    </div>
  );
};

export default ForgotPasswordForm;