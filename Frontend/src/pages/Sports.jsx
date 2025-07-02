import { useState, useEffect } from "react";
import NewsCard from "../components/NewsCard";
import axios from "axios";

function Sports({ language }) {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [translatedNews, setTranslatedNews] = useState([]);

  const backendUrl = import.meta.env.REACT_APP_BACKEND_URL || "https://ai-newsmenia-4.onrender.com";

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`${backendUrl}/api/news`, {
          headers: { "Content-Type": "application/json" },
        });
        const sportsNews = response.data.filter((article) => article.category === "sports");
        setNews(sportsNews);

        // Translate if language is not English
        if (language !== "en") {
          const translatedArticles = await Promise.all(
            sportsNews.map(async (article) => {
              try {
                const titleResponse = await axios.post(`${backendUrl}/api/translate`, {
                  text: article.title,
                  to: language,
                }, { headers: { "Content-Type": "application/json" } });
                const descriptionResponse = await axios.post(`${backendUrl}/api/translate`, {
                  text: article.description || "",
                  to: language,
                }, { headers: { "Content-Type": "application/json" } });
                return {
                  ...article,
                  title: titleResponse.data.translatedText,
                  description: descriptionResponse.data.translatedText,
                };
              } catch (translationError) {
                console.error("Error translating article:", translationError.message);
                return article; // Fallback to original
              }
            })
          );
          setTranslatedNews(translatedArticles);
        } else {
          setTranslatedNews(sportsNews);
        }
      } catch (error) {
        console.error("Error fetching sports news:", error.message, error.response?.data);
        setError("Failed to load sports news. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, [language, backendUrl]);

  if (loading) return <p>Loading sports news...</p>;
  if (error) return <p className="error">{error}</p>;
  return (
    <div className="news-grid">
      {translatedNews.length > 0 ? (
        translatedNews.map((article) => (
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