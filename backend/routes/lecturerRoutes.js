const express = require("express");
const router = express.Router();

// Lecturer dashboard route
router.get("/", (req, res) => {
  res.send("Welcome to the Lecturer Dashboard");
});

// Example lecturer action
router.post("/create-course", (req, res) => {
  res.send("Lecturer created a new course");
});

module.exports = router;
