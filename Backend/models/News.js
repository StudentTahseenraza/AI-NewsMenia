const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  source: { type: String, required: true },
  image: { type: String },
  description: { type: String },
  content: { type: String },
  publishedAt: { type: Date, default: Date.now },
  country: { type: String },
  category: { type: String },
});

module.exports = mongoose.model("News", newsSchema);