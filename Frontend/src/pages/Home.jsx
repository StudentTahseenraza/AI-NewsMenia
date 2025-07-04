import { useState, useEffect } from "react";
import NewsCard from "../components/NewsCard";
import axios from "axios";

function Home({ language }) {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const backendUrl = import.meta.env.REACT_APP_BACKEND_URL || "https://ai-newsmenia-2.onrender.com/";

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`${backendUrl}/api/news`, {
          headers: { "Content-Type": "application/json" },
        });
        // Optionally sort by publishedAt for recent news
        const sortedNews = response.data.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
        setNews(sortedNews.slice(0, 10)); // Limit to top 10 recent articles
      } catch (error) {
        console.error("Error fetching news:", error.message, error.response?.data);
        setError("Failed to load news. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, [backendUrl]);

  if (loading) return <p>Loading news...</p>;
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
            countryFlag="🇮🇳"
            description={article.description}
            fullContent={article.content}
            language={language}
          />
        ))
      ) : (
        <p>No news available.</p>
      )}
    </div>
  );
}

export default Home;