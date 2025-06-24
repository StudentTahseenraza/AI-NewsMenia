import { useState, useEffect } from "react";
import NewsCard from "../components/NewsCard";
import axios from "axios";

function Trending() {
  const [trendingNews, setTrendingNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pollVotes, setPollVotes] = useState({ option1: 0, option2: 0 });

  useEffect(() => {
    const fetchTrendingNews = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "https://newsapi.org/v2/everything?q=trending&sortBy=popularity&apiKey=YOUR_API_KEY"
        );
        setTrendingNews(response.data.articles);
      } catch (error) {
        console.error("Error fetching trending news:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTrendingNews();
  }, []);

  const handleVote = (option) => {
    setPollVotes((prev) => ({
      ...prev,
      [option]: prev[option] + 1,
    }));
  };

  const totalVotes = pollVotes.option1 + pollVotes.option2;
  const option1Percentage = totalVotes ? (pollVotes.option1 / totalVotes) * 100 : 0;
  const option2Percentage = totalVotes ? (pollVotes.option2 / totalVotes) * 100 : 0;

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
        {loading ? (
          <p>Loading trending news...</p>
        ) : trendingNews.length > 0 ? (
          trendingNews.map((article, index) => (
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
          <p>No trending news available.</p>
        )}
      </div>
    </div>
  );
}

export default Trending;