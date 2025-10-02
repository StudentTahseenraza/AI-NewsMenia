import "../styles/Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-links">
          <a href="#" className="footer-link">About</a>
          <a href="#" className="footer-link">Contact</a>
          <a href="#" className="footer-link">Privacy Policy</a>
          <a href="#" className="footer-link">Terms of Service</a>
        </div>
        <div className="social-icons">
          <a href="#" className="social-icon" aria-label="Twitter">🐦</a>
          <a href="#" className="social-icon" aria-label="Facebook">📘</a>
          <a href="#" className="social-icon" aria-label="LinkedIn">🔗</a>
        </div>
        <div className="footer-copyright">
          © 2024 NewsSphere. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;