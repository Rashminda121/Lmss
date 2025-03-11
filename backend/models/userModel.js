const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    uid: {
      type: String,
      unique: true,
      default: null,
    },
    name: {
      type: String,
      default: null,
    },
    email: {
      type: String,
      unique: true,
      default: null,
    },
    phone: {
      type: String,
      default: null,
    },
    image: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      default: "student",
    },
    password: {
      type: String,
      default: null,
    },
    address: {
      type: Object,
      default: null,
    },
  },
  {
    timestamps: true,
    minimize: false,
  }
);

const User = mongoose.models.users || mongoose.model("users", userSchema);

module.exports = User;
