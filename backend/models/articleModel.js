const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema(
  {
    uid: {
      type: String,
      default: null,
    },
    author: {
      type: String,
      default: null,
    },
    title: {
      type: String,
      default: "Title",
    },
    description: {
      type: String,
      default: "description",
    },
    image: {
      type: String,
      default: null,
    },
    url: {
      type: String,
      default: null,
    },
    category: {
      type: String,
      default: "general",
    },
    likes: {
      type: String,
      default: null,
    },
    comments: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
    minimize: false,
  }
);

const Article =
  mongoose.models.articles || mongoose.model("articles", articleSchema);

module.exports = Article;
