const express = require("express");
const router = express.Router();

// Admin dashboard route
router.get("/", (req, res) => {
  res.send("Welcome to the Admin Dashboard");
});

// Example admin action
router.post("/create-user", (req, res) => {
  res.send("Admin creates a new user");
});

module.exports = router;
