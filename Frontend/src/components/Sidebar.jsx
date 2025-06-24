import { Link } from "react-router-dom";
import "../styles/Sidebar.css";

function Sidebar() {
  return (
    <aside className="sidebar">
      <ul className="sidebar-menu">
        <li className="sidebar-item">
          <span className="icon">⭐</span>
          <Link to="/saved-news" style={{ color: "inherit", textDecoration: "none" }}>
            Saved News
          </Link>
        </li>
        <li className="sidebar-item">
          <span className="icon">⏳</span>
          <Link to="/missed-vault" style={{ color: "inherit", textDecoration: "none" }}>
            Missed Vault
          </Link>
        </li>
        <li className="sidebar-item">
          <span className="icon">🔥</span>
          <Link to="/trending" style={{ color: "inherit", textDecoration: "none" }}>
            Trending
          </Link>
        </li>
        <li className="sidebar-item">
          <span className="icon">📴</span>
          <Link to="/offline" style={{ color: "inherit", textDecoration: "none" }}>
            Offline Reading
          </Link>
        </li>
      </ul>
      <div className="sidebar-footer">
        <div className="sidebar-item">Settings</div>
        <div className="sidebar-links">
          <a href="#">About</a>
          <a href="#">Contact</a>
          <a href="#">Privacy Policy</a>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;