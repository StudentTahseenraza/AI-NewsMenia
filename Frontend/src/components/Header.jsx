import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Header.css";

function Header({ onLanguageChange, onMenuToggle }) {
  const [theme, setTheme] = useState("dark");
  const [language, setLanguage] = useState("en");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { currentUser, logout } = useAuth();

  useEffect(() => {
    document.documentElement.className = theme === "dark" ? "" : "light-mode";
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value;
    setLanguage(newLanguage);
    onLanguageChange(newLanguage);
  };

  const handleLogout = () => {
    logout();
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMenuToggle = () => {
    onMenuToggle();
  };

  return (
    <header className="header">
      {/* Hamburger Menu Button */}
      <button className="hamburger-menu" onClick={handleMenuToggle}>
        ☰
      </button>
      
      <div className="logo">NewsSphere</div>
      
      {/* Desktop Navigation */}
      <nav className="nav">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/politics" className="nav-link">Politics</Link>
        <Link to="/sports" className="nav-link">Sports</Link>
      </nav>

      {/* Mobile Menu Button */}
      <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
        ⋮
      </button>

      <div className={`header-right ${isMobileMenuOpen ? 'active' : ''}`}>
        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === "dark" ? "🌙" : "☀️"}
        </button>
        <div className="language-selector">
          <select value={language} onChange={handleLanguageChange}>
            <option value="en">En</option>
            <option value="hi">Hindi</option>
            <option value="ur">Urdu</option>
          </select>
        </div>
        {currentUser ? (
          <button className="auth-toggle" onClick={handleLogout}>Logout</button>
        ) : (
          <>
            <Link to="/login" className="auth-toggle">Login</Link>
            <Link to="/signup" className="auth-toggle">Sign Up</Link>
          </>
        )}
      </div>

      {/* Mobile Menu Overlay */}
      <div 
        className={`mobile-menu-overlay ${isMobileMenuOpen ? 'active' : ''}`}
        onClick={toggleMobileMenu}
      ></div>
    </header>
  );
}

export default Header;