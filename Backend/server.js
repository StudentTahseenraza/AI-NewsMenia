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
const frontendUrl = process.env.FRONTEND_URL || "https://vercel.com/new/tahseen-razas-projects/success?developer-id=&external-id=&redirect-url=&branch=main&deploymentUrl=ai-news-menia-immp-4e7wop3e6-tahseen-razas-projects.vercel.app&projectName=ai-news-menia-immp&s=https%3A%2F%2Fgithub.com%2FStudentTahseenraza%2FAI-NewsMenia&gitOrgLimit=&hasTrialAvailable=1&totalProjects=1&flow-id=8DX28iXAdh8WR_pnaJkSP"; // Add Vercel URL here
app.use(cors({ origin: [frontendUrl, "https://ai-news-menia-immp.vercel.app/"] })); // Replace with your Vercel URL
app.use(express.json());

// MongoDB Connection with Retry Logic
const connectWithRetry = () => {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.error("Error: MONGO_URI is not defined in .env file. Exiting.");
    process.exit(1);
  }

  mongoose
    .connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
      heartbeatFrequencyMS: 10000,
      maxPoolSize: 10,
      autoIndex: false, // Disable auto-indexing for performance in production
    })
    .then(() => console.log("MongoDB connected successfully:", mongoUri))
    .catch((err) => {
      console.error("MongoDB connection error:", err.message);
      console.log("Retrying connection in 5 seconds...");
      setTimeout(connectWithRetry, 5000);
    });
};

mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected. Attempting to reconnect...");
  connectWithRetry();
});

connectWithRetry();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/news", newsRoutes);

// Fake news detection route
app.post("/detect-fake-news", (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: "Text is required" });
  const isFake = Math.random() > 0.5;
  res.json({ label: isFake ? "Fake" : "Real", confidence: Math.random() * 100 });
});

// Summarization route using Hugging Face Inference API
app.post("/api/summarize", async (req, res) => {
  const { text, title } = req.body;

  if (!text || !title) {
    return res.status(400).json({ error: "Text and title are required" });
  }

  try {
    const hfToken = process.env.HF_API_TOKEN;
    if (!hfToken) {
      return res.status(500).json({ error: "Hugging Face API token is not configured" });
    }

    const response = await axios.post(
      "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
      {
        inputs: `Article Title: ${title}\n\n${text}`,
        parameters: {
          max_length: 100,
          min_length: 30,
          do_sample: false,
        },
      },
      {
        headers: { Authorization: `Bearer ${hfToken}` },
        timeout: 10000,
      }
    );

    const summary = response.data[0].summary_text;
    const points = summary.split(". ").filter((point) => point).map((point) => point + ".");
    res.json({ summary: points });
  } catch (error) {
    console.error("Error summarizing with Hugging Face:", error.response ? error.response.data : error.message);
    if (error.response?.status === 401) {
      return res.status(401).json({ error: "Invalid Hugging Face API token" });
    }
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
      timeout: 5000,
    });
    const translatedText = response.data.responseData.translatedText;
    if (!translatedText) throw new Error("Translation not available");
    res.json({ translatedText });
  } catch (error) {
    console.error("Error translating text with MyMemory:", error.response ? error.response.data : error.message);
    res.status(500).json({ error: "Failed to translate text" });
  }
});

// Fetch news function
const fetchNews = async () => {
  try {
    const categories = ["general", "politics", "sports"];
    const newsData = [];

    for (const category of categories) {
      console.log(`Fetching news for category: ${category}`);
      let response;
      try {
        response = await axios.get(
          `https://newsapi.org/v2/top-headlines?category=${category}&apiKey=${process.env.NEWSAPI_KEY}`,
          { timeout: 10000 }
        );
        console.log(`Full NewsAPI response for ${category}:`, response.data);
      } catch (error) {
        console.error(`NewsAPI failed for ${category}:`, error.response ? error.response.data : error.message);
        if (process.env.GNEWS_API_KEY) {
          console.log(`Falling back to GNews for ${category}`);
          response = await axios.get(
            `https://gnews.io/api/v4/top-headlines?category=${category}&lang=en&apikey=${process.env.GNEWS_API_KEY}`,
            { timeout: 10000 }
          );
          console.log(`Full GNews response for ${category}:`, response.data);
        } else {
          throw new Error("GNews API key not configured, fallback failed");
        }
      }

      const articles = response.data.articles.map((article) => ({
        title: article.title,
        source: article.source.name || article.source,
        image: article.urlToImage || article.image || "https://via.placeholder.com/600x300",
        description: article.description,
        content: article.content || article.description,
        publishedAt: article.publishedAt || article.published || new Date().toISOString(),
        category,
      }));
      newsData.push(...articles);
    }

    const News = require("./models/News");
    for (const article of newsData) {
      await News.updateOne(
        { title: article.title, publishedAt: article.publishedAt },
        { $set: article },
        { upsert: true, timeout: 10000 }
      ).catch((err) => console.error(`Error updating article ${article.title}:`, err));
    }
    console.log(`Updated and stored ${newsData.length} news articles`);
  } catch (error) {
    console.error("Error fetching news on startup:", error.message);
  }
};

// Fetch news on startup and schedule
fetchNews();
setInterval(fetchNews, 6 * 60 * 60 * 1000); // Every 6 hours

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));