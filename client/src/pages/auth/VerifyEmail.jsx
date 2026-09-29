import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, Mail, RefreshCw, XCircle } from "lucide-react";

import authApi from "../../features/auth/api/authApi";
import "./VerifyEmail.css";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");

  const [status, setStatus] = useState(token ? "verifying" : "waiting");

  const [message, setMessage] = useState("");

  const [email, setEmail] = useState("");

  const [resending, setResending] = useState(false);
  const [resendMessage, setResendMessage] = useState("");
  const [resendError, setResendError] = useState("");

  useEffect(() => {
    if (!token) {
      return;
    }

    const verify = async () => {
      try {
        setStatus("verifying");

        const response = await authApi.verifyEmail(token);

        setStatus("success");

        setMessage(
          response?.message || "Your email has been verified successfully.",
        );
      } catch (error) {
        setStatus("error");

        setMessage(
          error?.response?.data?.message ||
            "This verification link is invalid or has expired.",
        );
      }
    };

    verify();
  }, [token]);

  const handleResend = async () => {
    if (!email.trim()) {
      setResendError("Please enter your email address.");
      return;
    }

    try {
      setResending(true);
      setResendError("");
      setResendMessage("");

      const response = await authApi.resendVerification(email.trim());

      setResendMessage(
        response?.message || "A new verification email has been sent.",
      );
    } catch (error) {
      setResendError(
        error?.response?.data?.message ||
          "Unable to resend verification email.",
      );
    } finally {
      setResending(false);
    }
  };

  // --------------------------------
  // WAITING FOR EMAIL
  // --------------------------------

  if (status === "waiting") {
    return (
      <div className="verify-page">
        <div className="verify-card">
          <div className="verify-icon">
            <Mail size={36} />
          </div>

          <h1>Check Your Email</h1>

          <p>
            We've sent a verification link to your email address. Please check
            your inbox and click the verification link to activate your HireAI
            account.
          </p>

          <div className="resend-section">
            <div className="resend-title">
              <Mail size={20} />
              <span>Didn't receive the email?</span>
            </div>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />

            <button
              type="button"
              className="verify-button"
              onClick={handleResend}
              disabled={resending}
            >
              {resending ? "Sending..." : "Resend Verification Email"}
            </button>

            {resendMessage && <p className="resend-success">{resendMessage}</p>}

            {resendError && <p className="resend-error">{resendError}</p>}
          </div>

          <Link to="/login" className="back-login">
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  // --------------------------------
  // VERIFYING
  // --------------------------------

  if (status === "verifying") {
    return (
      <div className="verify-page">
        <div className="verify-card">
          <div className="verify-icon loading">
            <RefreshCw size={32} />
          </div>

          <h1>Verifying Your Email</h1>

          <p>Please wait while we verify your HireAI account.</p>
        </div>
      </div>
    );
  }

  // --------------------------------
  // SUCCESS
  // --------------------------------

  if (status === "success") {
    return (
      <div className="verify-page">
        <div className="verify-card">
          <div className="verify-icon success">
            <CheckCircle2 size={36} />
          </div>

          <h1>Email Verified!</h1>

          <p>{message}</p>

          <Link to="/login" className="verify-button">
            Continue to Login
          </Link>
        </div>
      </div>
    );
  }

  // --------------------------------
  // ERROR / EXPIRED TOKEN
  // --------------------------------

  return (
    <div className="verify-page">
      <div className="verify-card">
        <div className="verify-icon error">
          <XCircle size={36} />
        </div>

        <h1>Verification Failed</h1>

        <p>{message}</p>

        <div className="resend-section">
          <div className="resend-title">
            <Mail size={20} />
            <span>Need a new verification email?</span>
          </div>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />

          <button
            type="button"
            className="verify-button"
            onClick={handleResend}
            disabled={resending}
          >
            {resending ? "Sending..." : "Resend Verification Email"}
          </button>

          {resendMessage && <p className="resend-success">{resendMessage}</p>}

          {resendError && <p className="resend-error">{resendError}</p>}
        </div>

        <Link to="/login" className="back-login">
          Back to Login
        </Link>
      </div>
    </div>
  );
};

export default VerifyEmail;
