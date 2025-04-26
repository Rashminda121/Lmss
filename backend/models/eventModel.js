const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    uid: {
      type: String,
      default: null,
    },
    title: {
      type: String,
      default: "Title",
    },
    date: {
      type: Date,
      default: "date",
    },
    time: {
      type: String,
      default: "time",
    },
    location: {
      type: String,
      default: "location",
    },
    coordinates: {
      latitude: {
        type: String,
        default: null,
      },
      longitude: {
        type: String,
        default: null,
      },
    },
    description: {
      type: String,
      default: "description",
    },
    category: {
      type: String,
      default: "general",
    },
    type: {
      type: String,
      default: "online",
    },
    url: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      default: false,
    },
    image: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
    minimize: false,
  }
);

const Event = mongoose.models.events || mongoose.model("events", eventSchema);

module.exports = Event;
