const mongoose = require("mongoose");
const mysql = require("mysql2/promise");
require("dotenv").config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

const connectMysqlDB = async () => {
  try {
    const connection = await mysql.createConnection(process.env.MYSQL_URL);
    console.log("Connected to MySQL");
    return connection;
  } catch (error) {
    console.error("Error connecting to MySQL:", error);
    process.exit(1);
  }
};

module.exports = { connectDB, connectMysqlDB };
