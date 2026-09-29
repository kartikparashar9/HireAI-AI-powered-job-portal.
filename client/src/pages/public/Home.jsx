import {
  ArrowRight,
  BriefcaseBusiness,
  BrainCircuit,
  Search,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";

import { Link } from "react-router-dom";
import "./HomePage.css";

const categories = [
  "Technology",
  "Design",
  "Marketing",
  "Sales",
  "Finance",
  "Healthcare",
];

const Home = () => {
  return (
    <div className="home-page">
      {/* Hero */}

      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-content">
            <div className="hero-badge">
              <Sparkles size={15} />
              AI-powered career platform
            </div>

            <h1>
              Your AI-Powered
              <span> Job Portal</span>
            </h1>

            <p>
              Find your dream job, get AI-powered career guidance, match with
              top opportunities and build a better future with HireAI.
            </p>

            <div className="hero-search">
              <div className="hero-search-field">
                <Search size={19} />

                <input
                  type="text"
                  placeholder="Search jobs, companies, skills..."
                />
              </div>

              <div className="hero-location">
                <span>Location</span>
              </div>

              <button className="btn btn-primary">
                Search
                <ArrowRight size={17} />
              </button>
            </div>

            <div className="hero-features">
              <div>
                <span className="feature-icon">
                  <BrainCircuit size={17} />
                </span>

                <div>
                  <strong>AI Resume Analysis</strong>
                  <small>Get expert feedback</small>
                </div>
              </div>

              <div>
                <span className="feature-icon">
                  <Target size={17} />
                </span>

                <div>
                  <strong>Smart Job Matching</strong>
                  <small>Find your perfect fit</small>
                </div>
              </div>

              <div>
                <span className="feature-icon">
                  <TrendingUp size={17} />
                </span>

                <div>
                  <strong>Career Guidance</strong>
                  <small>Build your skills</small>
                </div>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-image-placeholder">
              <div className="hero-image-content">
                <BriefcaseBusiness size={72} />
                <span>AI Career</span>
              </div>
            </div>

            <div className="floating-card floating-card-top">
              <BrainCircuit size={19} />
              <div>
                <strong>AI Matches</strong>
                <span>Your Skills</span>
              </div>
            </div>

            <div className="floating-card floating-card-bottom">
              <TrendingUp size={19} />
              <div>
                <strong>Better Jobs</strong>
                <span>Higher Growth</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted Companies */}

      <section className="trusted-section" id="companies">
        <div className="container">
          <h3>Trusted by Leading Companies</h3>

          <div className="company-logos">
            <span>Google</span>
            <span>Microsoft</span>
            <span>amazon</span>
            <span>TCS</span>
            <span>Infosys</span>
            <span>accenture</span>
            <span>wipro</span>
          </div>
        </div>
      </section>

      {/* Categories */}

      <section className="section categories-section">
        <div className="container">
          <div className="section-heading">
            <div>
              <span className="section-eyebrow">Explore opportunities</span>
              <h2>Popular Job Categories</h2>
              <p>Discover opportunities across growing industries.</p>
            </div>

            <Link to="/jobs" className="section-link">
              View All <ArrowRight size={16} />
            </Link>
          </div>

          <div className="category-grid">
            {categories.map((category, index) => (
              <Link to="/jobs" className="category-card" key={category}>
                <span className={`category-icon category-icon-${index}`}>
                  <BriefcaseBusiness size={20} />
                </span>

                <strong>{category}</strong>

                <small>{(index + 2) * 120} jobs</small>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* AI Career */}

      <section className="section ai-section" id="ai-career">
        <div className="container ai-section-card">
          <div>
            <span className="section-eyebrow">HireAI Intelligence</span>

            <h2>
              Build your career with
              <span> AI-powered guidance.</span>
            </h2>

            <p>
              Analyze your resume, discover matching jobs, identify skill gaps,
              get recommendations and prepare for interviews.
            </p>

            <Link to="/register" className="btn btn-primary">
              Get Started
              <ArrowRight size={17} />
            </Link>
          </div>

          <div className="ai-feature-grid">
            <div>
              <BrainCircuit size={21} />
              <strong>Resume Analysis</strong>
              <span>AI-powered feedback</span>
            </div>

            <div>
              <Target size={21} />
              <strong>Job Matching</strong>
              <span>Find relevant roles</span>
            </div>

            <div>
              <TrendingUp size={21} />
              <strong>Skill Gap</strong>
              <span>Know what to learn</span>
            </div>

            <div>
              <Sparkles size={21} />
              <strong>Interview Prep</strong>
              <span>Practice smarter</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;