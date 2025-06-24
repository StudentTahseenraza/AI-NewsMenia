import { useState, useEffect } from "react";
import NewsCard from "../components/NewsCard";
import axios from "axios";

function Home({ language }) {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:5000/api/news/general");
        setNews(response.data);
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  return (
    <div className="news-grid">
      {loading ? (
        <p>Loading news...</p>
      ) : news.length > 0 ? (
        news.map((article, index) => (
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