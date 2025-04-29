const mongoose = require("mongoose");

const discussionSchema = new mongoose.Schema(
  {
    uid: {
      type: String,
      default: null,
    },
    uimage: {
      type: String,
      default: null,
    },
    name: {
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
    category: {
      type: String,
      default: "general",
    },
    email: {
      type: String,
      default: null,
    },
    comments: {
      type: Number,
      default: null,
    },
    role: {
      type: String,
      default: "student",
    },
  },
  {
    timestamps: true,
    minimize: false,
  }
);

const Discussion =
  mongoose.models.discussions ||
  mongoose.model("discussions", discussionSchema);

module.exports = Discussion;
