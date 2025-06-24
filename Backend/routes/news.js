const express = require("express");
const router = express.Router();
const News = require("../models/News");
const axios = require("axios");

// Fetch and store news (for demo purposes, called manually or via a cron job)
router.get("/fetch", async (req, res) => {
  try {
    const categories = ["general", "politics", "sports"];
    const newsData = [];

    for (const category of categories) {
      const response = await axios.get(
        `https://newsapi.org/v2/top-headlines?country=in&category=${category}&apiKey=${process.env.NEWSAPI_KEY}`
      );
      const articles = response.data.articles.map((article) => ({
        title: article.title,
        source: article.source.name,
        image: article.urlToImage,
        description: article.description,
        content: article.content,
        publishedAt: article.publishedAt,
        country: "in",
        category,
      }));
      newsData.push(...articles);
    }

    await News.deleteMany({}); // Clear old news
    await News.insertMany(newsData);
    res.json({ message: "News fetched and stored successfully", count: newsData.length });
  } catch (error) {
    console.error("Error fetching news:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all news by category
router.get("/:category", async (req, res) => {
  try {
    const { category } = req.params;
    const news = await News.find({ category });
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get news by ID
router.get("/id/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const news = await News.findById(id);
    if (!news) {
      return res.status(404).json({ message: "News not found" });
    }
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;