const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    uchatid: {
      type: String,
      default: null,
    },
    chats: [
      {
        uid: String,
        message: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
    minimize: false,
  }
);

const Chat = mongoose.models.chats || mongoose.model("chats", chatSchema);

module.exports = Chat;
