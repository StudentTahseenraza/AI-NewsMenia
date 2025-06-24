import { useState } from "react";
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
import AdminDashboard from "./pages/AdminDashboard";
import NewsDetail from "./pages/NewsDetail";
import "./styles/App.css";

function App() {
  const [language, setLanguage] = useState("en");

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
  };

  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Header onLanguageChange={handleLanguageChange} />
          <div className="main-content">
            <Sidebar />
            <div className="content">
              <Routes>
                <Route path="/" element={<Home language={language} />} />
                <Route path="/politics" element={<Politics language={language} />} />
                <Route path="/sports" element={<Sports language={language} />} />
                <Route path="/missed-vault" element={<MissedVault language={language} />} />
                <Route path="/trending" element={<Trending language={language} />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/admin" element={<AdminDashboard />} />
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