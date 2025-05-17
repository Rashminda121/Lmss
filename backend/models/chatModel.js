const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  uid: {
    type: String,
    default: null,
  },
  message: {
    type: String,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const chatSchema = new mongoose.Schema(
  {
    uchatid: {
      type: String,
      default: null,
    },
    chats: {
      type: messageSchema,
      default: () => ({}),
    },
  },
  {
    timestamps: true,
    minimize: false,
  }
);

const Chat = mongoose.models.chats || mongoose.model("chats", chatSchema);

module.exports = Chat;
