import { useState, useEffect } from "react";
import NewsCard from "../components/NewsCard";
import axios from "axios";

function Politics({ language }) {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const backendUrl = import.meta.env.REACT_APP_BACKEND_URL || "https://ai-newsmenia-2.onrender.com";

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`${backendUrl}/api/news`, {
          headers: { "Content-Type": "application/json" },
        });
        const politicsNews = response.data.filter((article) => article.category === "politics");
        setNews(politicsNews);
      } catch (error) {
        console.error("Error fetching politics news:", error.message, error.response?.data);
        setError("Failed to load politics news.");
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, [backendUrl]);

  if (loading) return <p>Loading politics news...</p>;
  if (error) return <p className="error">{error}</p>;
  return (
    <div className="news-grid">
      {news.length > 0 ? (
        news.map((article) => (
          <NewsCard
            key={article._id}
            index={article._id}
            title={article.title}
            source={article.source}
            image={article.image || "https://via.placeholder.com/300x150"}
            description={article.description}
            fullContent={article.content}
            language={language}
          />
        ))
      ) : (
        <p>No politics news available.</p>
      )}
    </div>
  );
}

export default Politics;