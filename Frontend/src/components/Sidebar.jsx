import { Link } from "react-router-dom";
import "../styles/Sidebar.css";

function Sidebar({ isOpen, onClose, isCollapsed, onToggleCollapse }) {
  const sidebarClass = `sidebar ${isOpen ? 'active' : ''} ${isCollapsed ? 'collapsed' : ''}`;

  return (
    <>
      <aside className={sidebarClass}>
        {/* Sidebar Header with Close Button */}
        <div className="sidebar-header">
          {!isCollapsed && <h3 className="sidebar-title">Navigation</h3>}
          <button className="sidebar-close" onClick={onClose}>
            ✕
          </button>
        </div>
        
        <ul className="sidebar-menu">
          <li className="sidebar-item">
            <span className="icon">⭐</span>
            {!isCollapsed && (
              <Link to="/saved-news" style={{ color: "inherit", textDecoration: "none" }} onClick={onClose}>
                Saved News
              </Link>
            )}
          </li>
          <li className="sidebar-item">
            <span className="icon">⏳</span>
            {!isCollapsed && (
              <Link to="/missed-vault" style={{ color: "inherit", textDecoration: "none" }} onClick={onClose}>
                Missed Vault
              </Link>
            )}
          </li>
          <li className="sidebar-item">
            <span className="icon">🔥</span>
            {!isCollapsed && (
              <Link to="/trending" style={{ color: "inherit", textDecoration: "none" }} onClick={onClose}>
                Trending
              </Link>
            )}
          </li>
          <li className="sidebar-item">
            <span className="icon">📴</span>
            {!isCollapsed && (
              <Link to="/offline" style={{ color: "inherit", textDecoration: "none" }} onClick={onClose}>
                Offline Reading
              </Link>
            )}
          </li>
        </ul>
        
        {!isCollapsed && (
          <div className="sidebar-footer">
            <div className="sidebar-item">Settings</div>
            <div className="sidebar-links">
              <a href="#" onClick={onClose}>About</a>
              <a href="#" onClick={onClose}>Contact</a>
              <a href="#" onClick={onClose}>Privacy Policy</a>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}

export default Sidebar;