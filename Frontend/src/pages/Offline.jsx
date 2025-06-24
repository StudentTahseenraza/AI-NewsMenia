import { useState, useEffect } from "react";
import NewsCard from "../components/NewsCard";

function Offline() {
  const [offlineArticles, setOfflineArticles] = useState([]);

  useEffect(() => {
    const savedArticles = JSON.parse(localStorage.getItem("offlineArticles")) || [];
    setOfflineArticles(savedArticles);
  }, []);

  const removeArticle = (indexToRemove) => {
    const updatedArticles = offlineArticles.filter((_, index) => index !== indexToRemove);
    localStorage.setItem("offlineArticles", JSON.stringify(updatedArticles));
    setOfflineArticles(updatedArticles);
  };

  return (
    <div className="news-grid">
      {offlineArticles.length > 0 ? (
        offlineArticles.map((article, index) => (
          <div key={index} className="offline-card-wrapper">
            <NewsCard
              title={article.title}
              source={article.source}
              image={article.image}
              description={article.description}
              fullContent={article.fullContent}
            />
            <button
              className="remove-btn"
              onClick={() => removeArticle(index)}
            >
              Remove
            </button>
          </div>
        ))
      ) : (
        <p>No offline articles available.</p>
      )}
    </div>
  );
}

export default Offline;