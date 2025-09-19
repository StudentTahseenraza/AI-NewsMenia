import { useState, useEffect } from "react";
import NewsCard from "../components/NewsCard";
import axios from "axios";

function MissedVault() {
  const [missedNews, setMissedNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

// src/config.js (better to keep in one place)
const backendUrl =
  import.meta.env.VITE_BACKEND_URL ||   // your .env variable (Vite uses VITE_ prefix)
  (import.meta.env.MODE === "development"
    ? "http://localhost:5000"           // local backend
    : "https://ai-newsmenia-2.onrender.com"); // production backend


  useEffect(() => {
    const fetchMissedNews = async () => {
      try {
        setLoading(true);
        setError(null);
        const today = new Date();
        const pastDate = new Date(today);
        pastDate.setDate(today.getDate() - 7); // Last 7 days
        const response = await axios.get(`${backendUrl}/api/news`, {
          headers: { "Content-Type": "application/json" },
        });
        const filteredNews = response.data.filter((article) => {
          const articleDate = new Date(article.publishedAt);
          return articleDate >= pastDate && articleDate <= today;
        });
        setMissedNews(filteredNews);
      } catch (error) {
        console.error("Error fetching missed news:", error.message, error.response?.data);
        setError("Failed to load missed news.");
      } finally {
        setLoading(false);
      }
    };
    fetchMissedNews();
  }, [backendUrl]);

  if (loading) return <p>Loading missed news...</p>;
  if (error) return <p className="error">{error}</p>;
  return (
    <div className="news-grid">
      {missedNews.length > 0 ? (
        missedNews.map((article, index) => (
          <NewsCard
            key={article._id || index}
            title={article.title}
            source={article.source}
            image={article.image || "https://via.placeholder.com/300x150"}
            description={article.description}
            fullContent={article.content}
          />
        ))
      ) : (
        <p>No missed news available.</p>
      )}
    </div>
  );
}

export default MissedVault;