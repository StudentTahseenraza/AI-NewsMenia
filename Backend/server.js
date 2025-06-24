const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const newsRoutes = require("./routes/news");
const axios = require("axios");

dotenv.config();

const app = express();

// Middleware
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/news", newsRoutes);

// Fake news detection route
app.post("/detect-fake-news", (req, res) => {
  const { text } = req.body;
  const isFake = Math.random() > 0.5;
  res.json({ label: isFake ? "Fake" : "Real", confidence: Math.random() });
});

// Summarization route using Hugging Face Inference API
app.post("/api/summarize", async (req, res) => {
  const { text, title } = req.body; // Include title for context

  if (!text || !title) {
    return res.status(400).json({ error: "Text and title are required" });
  }

  try {
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
      {
        inputs: `Article Title: ${title}\n\n${text}`,
        parameters: {
          max_length: 100, // Adjust based on desired summary length
          min_length: 30,
          do_sample: false,
        },
      },
      {
        headers: { "Authorization": "Bearer " }, // Leave blank for free tier
        timeout: 10000, // 10-second timeout
      }
    );

    const summary = response.data[0].summary_text;
    // Split into bullet points based on sentences
    const points = summary.split(". ").filter((point) => point).map((point) => point + ".");
    res.json({ summary: points });
  } catch (error) {
    console.error("Error summarizing with Hugging Face:", error.response ? error.response.data : error.message);
    res.status(500).json({ error: "Failed to summarize text" });
  }
});

// Translation route using MyMemory (free API)
app.post("/api/translate", async (req, res) => {
  const { text, to } = req.body;

  if (!text || !to) {
    return res.status(400).json({ error: "Text and target language are required" });
  }

  try {
    const response = await axios.get("https://api.mymemory.translated.net/get", {
      params: {
        q: text.length > 1000 ? text.substring(0, 1000) : text,
        langpair: `en|${to}`,
      },
    });
    const translatedText = response.data.responseData.translatedText;
    if (!translatedText) {
      throw new Error("Translation not available");
    }
    res.json({ translatedText });
  } catch (error) {
    console.error("Error translating text with MyMemory:", error.response ? error.response.data : error.message);
    res.status(500).json({ error: "Failed to translate text" });
  }
});

// Fetch news function (unchanged)
const fetchNews = async () => {
  try {
    const categories = ["general", "politics", "sports"];
    const newsData = [];

    for (const category of categories) {
      console.log(`Fetching news for category: ${category}`);
      let response;
      try {
        response = await axios.get(
          `https://newsapi.org/v2/top-headlines?category=${category}&apiKey=${process.env.NEWSAPI_KEY}`
        );
        console.log(`Full NewsAPI response for ${category}:`, response.data);
        console.log(`Fetched ${response.data.articles.length} articles for ${category} from NewsAPI`);
      } catch (error) {
        console.error(`NewsAPI failed for ${category}:`, error.response ? error.response.data : error.message);
        console.log(`Falling back to GNews for ${category}`);
        response = await axios.get(
          `https://gnews.io/api/v4/top-headlines?category=${category}&lang=en&apikey=${process.env.GNEWS_API_KEY}`
        );
        console.log(`Full GNews response for ${category}:`, response.data);
        console.log(`Fetched ${response.data.articles.length} articles for ${category} from GNews`);
      }

      const articles = response.data.articles.map((article) => ({
        title: article.title,
        source: article.source.name || article.source,
        image: article.urlToImage || article.image,
        description: article.description,
        content: article.content || article.description,
        publishedAt: article.publishedAt || article.published,
        category,
      }));
      newsData.push(...articles);
    }

    const News = require("./models/News");
    for (const article of newsData) {
      await News.updateOne(
        { title: article.title, publishedAt: article.publishedAt },
        { $set: article },
        { upsert: true }
      );
    }
    console.log(`Updated and stored ${newsData.length} news articles`);
  } catch (error) {
    console.error("Error fetching news on startup:", error.response ? error.response.data : error.message);
  }
};

// Fetch news on startup
fetchNews();

// Fetch news every 6 hours
setInterval(fetchNews, 6 * 60 * 60 * 1000);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));