import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Politics from "./pages/Politics";
import Sports from "./pages/Sports";
import Offline from "./pages/Offline";
import SavedNews from "./pages/SavedNews";
import MissedVault from "./pages/MissedVault";
import Trending from "./pages/Trending";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NewsDetail from "./pages/NewsDetail";
import "./App.css";

function App() {
  const [language, setLanguage] = useState("en");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const toggleSidebarCollapse = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Effect to handle body scroll when sidebar is open on mobile
  useEffect(() => {
    if (sidebarOpen) {
      document.body.classList.add('sidebar-open');
    } else {
      document.body.classList.remove('sidebar-open');
    }

    // Cleanup function
    return () => {
      document.body.classList.remove('sidebar-open');
    };
  }, [sidebarOpen]);

  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Header onLanguageChange={handleLanguageChange} onMenuToggle={toggleSidebar} />
          <div className="main-content">
            {/* Sidebar Overlay for Mobile */}
            <div 
              className={`sidebar-overlay ${sidebarOpen ? 'active' : ''}`} 
              onClick={closeSidebar}
            ></div>
            
            {/* Sidebar Wrapper with Toggle Button */}
            <div className="sidebar-wrapper">
              <Sidebar 
                isOpen={sidebarOpen} 
                onClose={closeSidebar}
                isCollapsed={sidebarCollapsed}
                onToggleCollapse={toggleSidebarCollapse}
              />
              
              {/* Desktop Toggle Button */}
              {!sidebarOpen && (
                <button 
                  className="sidebar-toggle" 
                  onClick={toggleSidebarCollapse}
                >
                  {sidebarCollapsed ? '→' : '←'}
                </button>
              )}
            </div>
            
            <div className={`content ${sidebarCollapsed ? 'collapsed' : ''}`}>
              <Routes>
                <Route path="/" element={<Home language={language} />} />
                <Route path="/politics" element={<Politics language={language} />} />
                <Route path="/sports" element={<Sports language={language} />} />
                <Route path="/missed-vault" element={<MissedVault language={language} />} />
                <Route path="/trending" element={<Trending language={language} />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/news/:id" element={<NewsDetail language={language} />} />
                <Route
                  path="/offline"
                  element={
                    <PrivateRoute>
                      <Offline language={language} />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/saved-news"
                  element={
                    <PrivateRoute>
                      <SavedNews language={language} />
                    </PrivateRoute>
                  }
                />
                <Route path="*" element={<h1>404 - Page Not Found</h1>} />
              </Routes>
            </div>
          </div>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;