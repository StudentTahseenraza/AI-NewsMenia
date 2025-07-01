import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Header.css";

function Header({ onLanguageChange }) {
  const [theme, setTheme] = useState("dark");
  const [language, setLanguage] = useState("en");
  const { currentUser, logout } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    document.documentElement.className = theme === "dark" ? "" : "light-mode";
  }, [theme]);

  useEffect(() => {
    if (currentUser && currentUser.role === "admin") {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, [currentUser]);

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

  return (
    <header className="header">
      <div className="logo">NewsSphere</div>
      <nav className="nav">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/politics" className="nav-link">Politics</Link>
        <Link to="/sports" className="nav-link">Sports</Link>
        {isAdmin && <Link to="/admin" className="nav-link">Admin</Link>}
      </nav>
      <div className="header-right">
        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === "dark" ? "Light" : "Dark"}
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
            <Link to="/admin" className="auth-toggle">Admin</Link>
          </>
        )}
      </div>
    </header>
  );
}

export default Header;