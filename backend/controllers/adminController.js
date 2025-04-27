const User = require("../models/userModel");
const Discussion = require("../models/discussionModel");
const Event = require("../models/eventModel");
const DisComment = require("../models/discussionCommentsModel");
const EventComment = require("../models/eventCommentsModel");
const { connectMysqlDB } = require("../db/db");
const jwt = require("jsonwebtoken");

const adminProfile = (req, res) => {
  res.send("Admin profile details");
};

const createUser = (req, res) => {
  res.send("Admin creates a new user");
};

const updateUser = (req, res) => {
  res.send("Admin updates the user");
};

const deleteUser = (req, res) => {
  res.send("Admin deletes the user");
};

const dashboard = async (req, res) => {
  try {
    const discussionCount = await Discussion.countDocuments({});
    const userCount = await User.countDocuments({});
    const eventCount = await Event.countDocuments({});
    const disCommentCount = await DisComment.countDocuments({});
    const eventCommentCount = await EventComment.countDocuments({});
    //const articleCount = await Articles.countDocuments({});

    const mysqlConnection = await connectMysqlDB();
    const [courses] = await mysqlConnection.execute(
      "SELECT COUNT(*) AS courseCount FROM course"
    );
    const courseCount = courses[0].courseCount;

    await mysqlConnection.end();

    const commentCount = disCommentCount + eventCommentCount;

    const countData = {
      discussionCount,
      userCount,
      courseCount,
      eventCount,
      commentCount,
      disCommentCount,
      eventCommentCount,
    };

    res.status(200).json(countData);
  } catch (error) {
    console.error("Error fetching data:", error);
    res
      .status(500)
      .json({ message: "Error getting dashboard data", error: error.message });
  }
};

const listUsers = async (req, res) => {
  try {
    const users = await User.find({});

    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found." });
    }

    res.status(200).json(users);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error getting users", error: error.message });
  }
};

module.exports = {
  adminProfile,
  createUser,
  updateUser,
  deleteUser,
  dashboard,
  listUsers,
};
