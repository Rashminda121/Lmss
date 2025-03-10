require("dotenv").config();
const { connectDB } = require("./db/db");

const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost/3000",
  })
);

const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/userRoutes");
const lecturerRoutes = require("./routes/lecturerRoutes");

app.use("/admin", adminRoutes);
app.use("/user", userRoutes);
app.use("/lecturer", lecturerRoutes);

app.get("/", (req, res) => {
  res.send("Hello from the backend!");
});

connectDB()
  .then(() => {
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to the database:", error);
    process.exit(1);
  });
