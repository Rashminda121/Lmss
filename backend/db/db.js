const mongoose = require("mongoose");
const mysql = require("mysql2/promise");
require("dotenv").config();

const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 3000;

const connectDB = async (retries = MAX_RETRIES) => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    if (retries > 0) {
      console.log(
        `Retrying MongoDB connection in ${
          RETRY_DELAY_MS / 1000
        } seconds... (${retries} retries left)`
      );
      await new Promise((res) => setTimeout(res, RETRY_DELAY_MS));
      return connectDB(retries);
    } else {
      console.error("Max retries for MongoDB reached. Exiting.");
      process.exit(1);
    }
  }
};

const connectMysqlDB = async (retries = MAX_RETRIES) => {
  try {
    const connection = await mysql.createConnection(process.env.MYSQL_URL);
    console.log("Connected to MySQL");
    return connection;
  } catch (error) {
    console.error("Error connecting to MySQL:", error.message);
    if (retries > 0) {
      console.log(
        `Retrying MySQL connection in ${
          RETRY_DELAY_MS / 1000
        } seconds... (${retries} retries left)`
      );
      await new Promise((res) => setTimeout(res, RETRY_DELAY_MS));
      return connectMysqlDB(retries);
    } else {
      console.error("Max retries for MySQL reached. Exiting.");
      process.exit(1);
    }
  }
};

module.exports = { connectDB, connectMysqlDB };
