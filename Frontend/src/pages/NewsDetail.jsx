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

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/news/id/${id}`);
        const selectedArticle = response.data;
        setArticle(selectedArticle);
        setTranslatedContent(selectedArticle.content || selectedArticle.description || selectedArticle.title);
      } catch (error) {
        console.error("Error fetching article:", error);
        navigate("/");
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [id, navigate]);

  const handleTranslate = async () => {
    try {
      const textToTranslate = article.content || article.description || article.title;
      const response = await axios.get("https://api.mymemory.translated.net/get", {
        params: {
          q: textToTranslate,
          langpair: `en|${language}`,
        },
      });
      setTranslatedContent(response.data.responseData.translatedText);
      setIsTranslated(true);
    } catch (error) {
      console.error("Error translating:", error);
      setTranslatedContent("Translation failed.");
    }
  };

  const handleSummarize = async () => {
    if (isSummarized) {
      // Toggle off the summary
      setSummary([]);
      setIsSummarized(false);
      return;
    }

    try {
      const textToSummarize = article.content || article.description || article.title;
      const response = await axios.post(
        "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
        {
          inputs: `Article Title: ${article.title}\n\n${textToSummarize}`,
          parameters: {
            max_length: 200, // Increased to capture more points
            min_length: 50,  // Increased to ensure sufficient content
            do_sample: false,
          },
        },
        {
          headers: { "Authorization": "Bearer hf_xxxxxxxxxxxxxxxxxxxxxxxxxx" }, // Replace with your token
          timeout: 10000,
        }
      );
      const summaryText = response.data[0].summary_text;
      // Improved splitting to handle multiple sentence boundaries
      const points = summaryText
        .split(/\.|!|\?/) // Split on period, exclamation, or question mark
        .filter((point) => point.trim()) // Remove empty or whitespace-only points
        .map((point) => point.trim() + "."); // Add period and trim whitespace
      setSummary(points);
      setIsSummarized(true);
    } catch (error) {
      console.error("Error summarizing:", error);
      if (error.response?.status === 401) {
        setSummary(["Authorization required. Please obtain a Hugging Face API token."]);
      } else {
        setSummary(["Summarization failed."]);
      }
    }
  };

  if (loading) {
    return <p>Loading article...</p>;
  }

  if (!article) {
    return <p>Article not found.</p>;
  }

  return (
    <div className="news-detail">
      <button className="back-btn" onClick={() => navigate(-1)}>Back</button>
      <div className="news-detail-card">
        <img src={article.image || "https://via.placeholder.com/600x300"} alt={article.title} className="news-detail-image" />
        <div className="news-detail-content">
          <h2 className="news-detail-title">{article.title}</h2>
          <div className="news-detail-source">
            {article.source} • {new Date(article.publishedAt).toLocaleDateString()}
          </div>
          <p className="news-detail-content-text">{isTranslated ? translatedContent : (article.content || article.description)}</p>
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
            <button className="action-btn" onClick={handleSummarize}>
              {isSummarized ? "Hide Summary" : "Summarize"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewsDetail;