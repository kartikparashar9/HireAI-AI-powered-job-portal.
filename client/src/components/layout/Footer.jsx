const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div>
          <div className="footer-brand">HireAI</div>

          <p>
            AI-powered job discovery and career guidance for modern job seekers.
          </p>
        </div>

        <div className="footer-links">
          <a href="#jobs">Jobs</a>
          <a href="#companies">Companies</a>
          <a href="#ai-career">AI Career</a>
          <a href="#resources">Resources</a>
        </div>
      </div>

      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} HireAI</span>

        <span>Built for better careers.</span>
      </div>
    </footer>
  );
};

export default Footer;
