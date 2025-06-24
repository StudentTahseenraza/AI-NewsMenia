import { useState, useEffect } from "react";
import NewsCard from "../components/NewsCard";

function SavedNews() {
  const [savedArticles, setSavedArticles] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("savedArticles")) || [];
    setSavedArticles(saved);
  }, []);

  const removeArticle = (indexToRemove) => {
    const updatedArticles = savedArticles.filter((_, index) => index !== indexToRemove);
    localStorage.setItem("savedArticles", JSON.stringify(updatedArticles));
    setSavedArticles(updatedArticles);
  };

  return (
    <div className="news-grid">
      {savedArticles.length > 0 ? (
        savedArticles.map((article, index) => (
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
        <p>No saved articles available.</p>
      )}
    </div>
  );
}

export default SavedNews;