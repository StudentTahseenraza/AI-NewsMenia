import { useState, useEffect } from "react";
import NewsCard from "../components/NewsCard";
import axios from "axios";

function Sports({ language }) {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [translatedNews, setTranslatedNews] = useState([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get("http://localhost:5000/api/news/sports");
        const articles = response.data;

        setNews(articles);

        // Translate titles and descriptions if language is not English
        if (language !== "en") {
          const translatedArticles = await Promise.all(
            articles.map(async (article) => {
              try {
                const titleResponse = await axios.post("http://localhost:5000/api/translate", {
                  text: article.title,
                  to: language,
                });
                const descriptionResponse = await axios.post("http://localhost:5000/api/translate", {
                  text: article.description || "",
                  to: language,
                });
                return {
                  ...article,
                  title: titleResponse.data.translatedText,
                  description: descriptionResponse.data.translatedText,
                };
              } catch (translationError) {
                console.error("Error translating article:", translationError);
                return article; // Fallback to original article
              }
            })
          );
          setTranslatedNews(translatedArticles);
        } else {
          setTranslatedNews(articles);
        }
      } catch (error) {
        console.error("Error fetching sports news:", error);
        setError("Failed to load sports news. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, [language]);

  return (
    <div className="news-grid">
      {loading ? (
        <p>Loading sports news...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : translatedNews.length > 0 ? (
        translatedNews.map((article, index) => (
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
        <p>No sports news available.</p>
      )}
    </div>
  );
}

export default Sports;