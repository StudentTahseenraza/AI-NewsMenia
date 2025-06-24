import { useState, useEffect } from "react";
import NewsCard from "../components/NewsCard";
import axios from "axios";

function MissedVault() {
  const [missedNews, setMissedNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMissedNews = async () => {
      try {
        setLoading(true);
        const today = new Date();
        const pastDate = new Date(today);
        pastDate.setDate(today.getDate() - 7); // Fetch news from the last 7 days
        const fromDate = pastDate.toISOString().split("T")[0];
        const toDate = today.toISOString().split("T")[0];

        const response = await axios.get(
          `https://newsapi.org/v2/everything?q=news&from=${fromDate}&to=${toDate}&apiKey=YOUR_API_KEY`
        );
        setMissedNews(response.data.articles);
      } catch (error) {
        console.error("Error fetching missed news:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMissedNews();
  }, []);

  return (
    <div className="news-grid">
      {loading ? (
        <p>Loading missed news...</p>
      ) : missedNews.length > 0 ? (
        missedNews.map((article, index) => (
          <NewsCard
            key={index}
            title={article.title}
            source={article.source.name}
            image={article.urlToImage || "https://via.placeholder.com/300x150"}
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