import { Eye, EyeOff, LockKeyhole, Mail, User } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../authSlice";

const RegisterForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isLoading, error, successMessage } = useSelector(
    (state) => state.auth,
  );

  const [showPassword, setShowPassword] = useState(false);

  const [role, setRole] = useState("JOB_SEEKER");

  const [formData, setFormData] = useState({
    name: "",
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

    const result = await dispatch(
      registerUser({
        ...formData,
        role,
      }),
    );

    if (registerUser.fulfilled.match(result)) {
      navigate("/verify-email", {
        replace: true,
        state: {
          email: formData.email,
          message:
            result.payload?.message ||
            "Registration successful. Please verify your email.",
        },
      });
    }
  };

  return (
    <div className="auth-form">
      <div className="auth-heading">
        <span className="auth-eyebrow">Start your journey</span>

        <h2>Create Account</h2>

        <p>Create your HireAI account and discover better opportunities.</p>
      </div>

      {error && <div className="auth-error">{error}</div>}

      {successMessage && <div className="auth-success">{successMessage}</div>}

      <div className="role-selector">
        <button
          type="button"
          className={role === "JOB_SEEKER" ? "active" : ""}
          onClick={() => setRole("JOB_SEEKER")}
        >
          Job Seeker
        </button>

        <button
          type="button"
          className={role === "RECRUITER" ? "active" : ""}
          onClick={() => setRole("RECRUITER")}
        >
          Recruiter
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <label className="form-label">
          Full Name
          <div className="input-wrapper">
            <User size={17} />

            <input
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              minLength={2}
              required
            />
          </div>
        </label>

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
              placeholder="Minimum 8 characters"
              value={formData.password}
              onChange={handleChange}
              minLength={8}
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

        <button
          type="submit"
          className="btn btn-primary auth-submit"
          disabled={isLoading}
        >
          {isLoading ? "Creating Account..." : "Create Account"}
        </button>
      </form>

      <p className="auth-bottom-text">
        Already have an account? <Link to="/login">Sign In</Link>
      </p>
    </div>
  );
};

export default RegisterForm;