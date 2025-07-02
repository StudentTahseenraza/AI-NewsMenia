import { useState, useEffect } from "react";
import NewsCard from "../components/NewsCard";
import axios from "axios";

function Trending() {
  const [trendingNews, setTrendingNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pollVotes, setPollVotes] = useState({ option1: 0, option2: 0 });

  const backendUrl = import.meta.env.REACT_APP_BACKEND_URL || "https://ai-newsmenia-2.onrender.com/";

  useEffect(() => {
    const fetchTrendingNews = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`${backendUrl}/api/news`, {
          headers: { "Content-Type": "application/json" },
        });
        // Sort by publishedAt (recent) as a proxy for trending; adjust if backend has a trending endpoint
        const sortedNews = response.data.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
        setTrendingNews(sortedNews.slice(0, 5)); // Top 5 as trending
      } catch (error) {
        console.error("Error fetching trending news:", error.message, error.response?.data);
        setError("Failed to load trending news.");
      } finally {
        setLoading(false);
      }
    };
    fetchTrendingNews();
  }, [backendUrl]);

  const handleVote = (option) => {
    setPollVotes((prev) => ({
      ...prev,
      [option]: prev[option] + 1,
    }));
  };

  const totalVotes = pollVotes.option1 + pollVotes.option2;
  const option1Percentage = totalVotes ? (pollVotes.option1 / totalVotes) * 100 : 0;
  const option2Percentage = totalVotes ? (pollVotes.option2 / totalVotes) * 100 : 0;

  if (loading) return <p>Loading trending news...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div>
      <div className="poll-section">
        <h3>Today's Poll: Is AI the Future of News?</h3>
        <div className="poll-options">
          <button className="poll-btn" onClick={() => handleVote("option1")}>
            Yes ({pollVotes.option1} votes)
            <div className="poll-bar" style={{ width: `${option1Percentage}%` }}></div>
          </button>
          <button className="poll-btn" onClick={() => handleVote("option2")}>
            No ({pollVotes.option2} votes)
            <div className="poll-bar" style={{ width: `${option2Percentage}%` }}></div>
          </button>
        </div>
      </div>
      <div className="news-grid">
        {trendingNews.length > 0 ? (
          trendingNews.map((article, index) => (
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
          <p>No trending news available.</p>
        )}
      </div>
    </div>
  );
}

export default Trending;