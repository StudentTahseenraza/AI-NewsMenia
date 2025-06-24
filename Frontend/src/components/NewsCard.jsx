import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/NewsCard.css";

function NewsCard({ title, source, image, countryFlag, description, fullContent, index }) {
  const navigate = useNavigate();
  const [isSavedOffline, setIsSavedOffline] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [fakeNewsResult, setFakeNewsResult] = useState(null);
  const [isCheckingFake, setIsCheckingFake] = useState(false);

  const handleCardClick = () => {
    navigate(`/news/${index}`);
  };

  const handleSaveOffline = () => {
    const article = { title, source, image, description, fullContent };
    const savedArticles = JSON.parse(localStorage.getItem("offlineArticles")) || [];
    localStorage.setItem("offlineArticles", JSON.stringify([...savedArticles, article]));
    setIsSavedOffline(true);
  };

  const handleSave = () => {
    const article = { title, source, image, description, fullContent };
    const savedArticles = JSON.parse(localStorage.getItem("savedArticles")) || [];
    localStorage.setItem("savedArticles", JSON.stringify([...savedArticles, article]));
    setIsSaved(true);
  };

  const handlePlayAudio = () => {
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      const utterance = new SpeechSynthesisUtterance(fullContent || description || title);
      utterance.onend = () => setIsPlaying(false);
      window.speechSynthesis.speak(utterance);
      setIsPlaying(true);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: title,
        text: description,
        url: window.location.href,
      }).catch((error) => console.error("Error sharing:", error));
    } else {
      alert("Sharing is not supported on this device.");
    }
  };

  const handleCheckFakeNews = async () => {
    setIsCheckingFake(true);
    try {
      const response = await axios.post("http://localhost:5000/detect-fake-news", {
        text: fullContent || description || title,
      });
      setFakeNewsResult(response.data);
    } catch (error) {
      console.error("Error checking fake news:", error);
      setFakeNewsResult({ label: "Error", confidence: 0 });
    } finally {
      setIsCheckingFake(false);
    }
  };

  return (
    <div className="news-card" onClick={handleCardClick}>
      <img src={image} alt={title} className="news-image" />
      <div className="news-content">
        <h3 className="news-title">{title}</h3>
        <div className="news-source">
          {countryFlag && <span className="flag">{countryFlag}</span>} {source}
        </div>
        {fakeNewsResult && (
          <p className="fake-news-result">
            Fake News Detection: <span className={fakeNewsResult.label.toLowerCase()}>
              {fakeNewsResult.label} ({(fakeNewsResult.confidence * 100).toFixed(2)}%)
            </span>
          </p>
        )}
        <div className="news-actions">
          <button className="action-btn" onClick={(e) => { e.stopPropagation(); handleSaveOffline(); }}>
            {isSavedOffline ? "Saved Offline" : "Save Offline"}
          </button>
          <button className="action-btn" onClick={(e) => { e.stopPropagation(); handlePlayAudio(); }}>
            {isPlaying ? "Stop Audio" : "Play Audio"}
          </button>
          <button className="action-btn" onClick={(e) => { e.stopPropagation(); handleCheckFakeNews(); }} disabled={isCheckingFake}>
            {isCheckingFake ? "Checking..." : "Check Fake News"}
          </button>
          <button className="action-icon" onClick={(e) => { e.stopPropagation(); handleSave(); }}>
            {isSaved ? "⭐ Saved" : "⭐"}
          </button>
          <button className="action-icon" onClick={(e) => { e.stopPropagation(); handleShare(); }}>
            📤
          </button>
        </div>
      </div>
    </div>
  );
}

export default NewsCard;