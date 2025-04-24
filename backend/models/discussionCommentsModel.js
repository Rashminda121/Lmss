const mongoose = require("mongoose");

const disCommentSchema = new mongoose.Schema(
  {
    disid: {
      type: String,
      default: null,
    },
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
    description: {
      type: String,
      default: "description",
    },
    email: {
      type: String,
      default: null,
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    minimize: false,
  }
);

const DisComment =
  mongoose.models.discussionComments ||
  mongoose.model("discussionComments", disCommentSchema);

module.exports = DisComment;
