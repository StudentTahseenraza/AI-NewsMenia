import { useState, useEffect } from "react";
import NewsCard from "../components/NewsCard";
import axios from "axios";

function Politics({ language }) {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:5000/api/news/politics");
        setNews(response.data);
      } catch (error) {
        console.error("Error fetching politics news:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  return (
    <div className="news-grid">
      {loading ? (
        <p>Loading politics news...</p>
      ) : news.length > 0 ? (
        news.map((article, index) => (
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