const express = require("express");
const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// Simple route
app.get("/", (req, res) => {
  res.send("Hello from the Node.js backend!");
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
