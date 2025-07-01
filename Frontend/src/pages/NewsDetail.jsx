import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/NewsDetail.css";

function NewsDetail({ language }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [translatedContent, setTranslatedContent] = useState("");
  const [isTranslated, setIsTranslated] = useState(false);
  const [summary, setSummary] = useState([]);
  const [isSummarized, setIsSummarized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Use environment variable for backend URL
  const backendUrl = process.env.REACT_APP_BACKEND_URL || "https://ai-newsmenia-3.onrender.com";

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log(`Fetching from: ${backendUrl}/api/news/id/${id}`); // Debug log
        const response = await axios.get(`${backendUrl}/api/news/id/${id}`, {
          headers: { "Content-Type": "application/json" },
        });
        const selectedArticle = response.data;
        if (!selectedArticle || Object.keys(selectedArticle).length === 0) throw new Error("Article not found");
        setArticle(selectedArticle);
        console.log("Article fetched:", selectedArticle); // Debug log
      } catch (error) {
        console.error("Error fetching article:", error.message, error.response?.status, error.response?.data);
        setError(`Failed to load article. Status: ${error.response?.status || error.message}`);
        setArticle({});
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [id, navigate, backendUrl]);

  const handleTranslate = async () => {
    if (!article?.content && !article?.description && !article?.title) {
      setError("No content available for translation.");
      return;
    }
    try {
      const textToTranslate = article?.content || article?.description || article?.title || "";
      const response = await axios.post(`${backendUrl}/api/translate`, {
        text: textToTranslate,
        to: language,
      }, {
        headers: { "Content-Type": "application/json" },
      });
      setTranslatedContent(response.data.translatedText);
      setIsTranslated(true);
    } catch (error) {
      console.error("Error translating:", error.message, error.response?.data);
      setTranslatedContent("Translation failed.");
    }
  };

  const handleSummarize = async () => {
    if (!article?.content && !article?.description && !article?.title) {
      setError("No content available for summarization.");
      return;
    }
    try {
      const textToSummarize = article?.content || article?.description || article?.title || "";
      const response = await axios.post(`${backendUrl}/api/summarize`, {
        text: textToSummarize,
        title: article?.title || "No Title",
      }, {
        headers: { "Content-Type": "application/json" },
      });
      setSummary(response.data.summary);
      setIsSummarized(true);
    } catch (error) {
      console.error("Error summarizing:", error.message, error.response?.data);
      setSummary(["Summarization failed. Please try again later."]);
    }
  };

  if (loading) return <p>Loading article...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!article || Object.keys(article).length === 0) return <p>Article not found.</p>;

  return (
    <div className="news-detail">
      <button className="back-btn" onClick={() => navigate(-1)}>Back</button>
      <div className="news-detail-card">
        <img
          src={article.image || "https://via.placeholder.com/600x300"}
          alt={article.title || "News Image"}
          className="news-detail-image"
        />
        <div className="news-detail-content">
          <h2 className="news-detail-title">{article.title || "No Title"}</h2>
          <div className="news-detail-source">
            {article.source || "Unknown Source"} • {new Date(article.publishedAt || Date.now()).toLocaleDateString()}
          </div>
          <p className="news-detail-content-text">
            {isTranslated ? translatedContent : (article.content || article.description || "No content")}
          </p>
          {isSummarized && (
            <div className="news-detail-summary">
              Summary:
              <ul>
                {summary.map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
            </div>
          )}
          <div className="news-detail-actions">
            <button className="action-btn" onClick={handleTranslate}>Translate</button>
            <button className="action-btn" onClick={handleSummarize}>
              {isSummarized ? "Hide Summary" : "Summarize"}
            </button>
          </div>
        </div>
      </div>
      <p>Debug: {JSON.stringify(article)}</p> {/* Debug output */}
    </div>
  );
}

export default NewsDetail;