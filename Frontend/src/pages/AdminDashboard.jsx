import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import axios from "axios";
import "../styles/AdminDashboard.css";

function AdminDashboard() {
  const { currentUser } = useAuth();
  const [news, setNews] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Use environment variable for backend URL
  const backendUrl = import.meta.env.REACT_APP_BACKEND_URL || "https://ai-newsmenia-4.onrender.com/";

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch news from backend
        const newsResponse = await axios.get(`${backendUrl}/api/news`, {
          headers: { "Content-Type": "application/json" },
        });
        setNews(newsResponse.data);

        // Fetch users from backend
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No authentication token found");
        const usersResponse = await axios.get(`${backendUrl}/api/users`, {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        });
        setUsers(usersResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error.message, error.response?.data);
        setError("Failed to load data. Please try again or check your authentication.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [backendUrl]);

  const handleDeleteNews = (id) => {
    setNews(news.filter((article) => article._id !== id));
    // Note: This is a UI update only; actual deletion should be handled by the backend
    // Uncomment and implement backend delete endpoint if available
    // try {
    //   const token = localStorage.getItem("token");
    //   await axios.delete(`${backendUrl}/api/news/id/${id}`, {
    //     headers: { Authorization: `Bearer ${token}` },
    //   });
    // } catch (error) {
    //   console.error("Error deleting news:", error);
    //   setError("Failed to delete news.");
    // }
  };

  const handleBanUser = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");
      await axios.post(
        `${backendUrl}/api/users/ban`,
        { userId },
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      );
      setUsers(users.filter((user) => user._id !== userId)); // Assuming _id is the user ID field
      alert(`User with ID ${userId} has been banned.`);
    } catch (error) {
      console.error("Error banning user:", error.message, error.response?.data);
      setError("Failed to ban user. Please try again.");
    }
  };

  if (!currentUser || currentUser.role !== "admin") {
    return <Navigate to="/" />;
  }

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>
      {error && <p className="error">{error}</p>}
      <div className="admin-section">
        <h3>Manage News Articles</h3>
        {loading ? (
          <p>Loading news...</p>
        ) : news.length > 0 ? (
          <div className="admin-news-grid">
            {news.map((article) => (
              <div key={article._id} className="admin-news-card">
                <img
                  src={article.image || "https://via.placeholder.com/150"}
                  alt={article.title || "News Image"}
                />
                <div className="admin-news-content">
                  <h4>{article.title || "No Title"}</h4>
                  <p>{article.source || "Unknown Source"}</p>
                  <button
                    className="admin-action-btn delete-btn"
                    onClick={() => handleDeleteNews(article._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No news available.</p>
        )}
      </div>
      <div className="admin-section">
        <h3>Manage Users</h3>
        {loading ? (
          <p>Loading users...</p>
        ) : users.length > 0 ? (
          <div className="admin-users-grid">
            {users.map((user) => (
              <div key={user._id} className="admin-user-card">
                <p>Email: {user.email || "No Email"}</p>
                <p>Role: {user.role || "User"}</p>
                {user.role !== "admin" && (
                  <button
                    className="admin-action-btn ban-btn"
                    onClick={() => handleBanUser(user._id)}
                  >
                    Ban User
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p>No users available.</p>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;