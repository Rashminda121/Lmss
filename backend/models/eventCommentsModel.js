const mongoose = require("mongoose");

const eventCommentSchema = new mongoose.Schema(
  {
    eid: {
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
    text: {
      type: String,
      default: "text",
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

const EventComment =
  mongoose.models.eventComments ||
  mongoose.model("eventComments", eventCommentSchema);

module.exports = EventComment;
