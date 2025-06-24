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

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "https://newsapi.org/v2/everything?q=news&apiKey=YOUR_API_KEY"
        );
        setNews(response.data.articles);
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    };

    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchNews();
    fetchUsers().finally(() => setLoading(false));
  }, []);

  const handleDeleteNews = (index) => {
    const updatedNews = news.filter((_, i) => i !== index);
    setNews(updatedNews);
  };

  const handleBanUser = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/users/ban",
        { userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(`User with ID ${userId} has been banned.`);
      setUsers(users.filter((user) => user.id !== userId));
    } catch (error) {
      console.error("Error banning user:", error);
    }
  };

  if (!currentUser || currentUser.role !== "admin") {
    return <Navigate to="/" />;
  }

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>
      <div className="admin-section">
        <h3>Manage News Articles</h3>
        {loading ? (
          <p>Loading news...</p>
        ) : news.length > 0 ? (
          <div className="admin-news-grid">
            {news.map((article, index) => (
              <div key={index} className="admin-news-card">
                <img src={article.urlToImage || "https://via.placeholder.com/150"} alt={article.title} />
                <div className="admin-news-content">
                  <h4>{article.title}</h4>
                  <p>{article.source.name}</p>
                  <button
                    className="admin-action-btn delete-btn"
                    onClick={() => handleDeleteNews(index)}
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
        {users.length > 0 ? (
          <div className="admin-users-grid">
            {users.map((user) => (
              <div key={user.id} className="admin-user-card">
                <p>Email: {user.email}</p>
                <p>Role: {user.role}</p>
                {user.role !== "admin" && (
                  <button
                    className="admin-action-btn ban-btn"
                    onClick={() => handleBanUser(user.id)}
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