const User = require("../models/userModel");
const Discussion = require("../models/discussionModel");
const Event = require("../models/eventModel");
const DisComment = require("../models/discussionCommentsModel");
const EventComment = require("../models/eventCommentsModel");
const Article = require("../models/articleModel");
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

const addArticle = async (req, res) => {
  try {
    const { uid, author, title, description, image, url, category } = req.body;

    if (!author || !title || !description || !image || !category) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newArticle = new Article({
      uid,
      author,
      title,
      description,
      image,
      url: url ? url : "",
      category,
    });
    await newArticle.save();

    res.status(201).json({ message: "Article added successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating article", error: error.message });
  }
};

const updateArticle = async (req, res) => {
  try {
    const { _id, uid, author, title, description, image, url, category } =
      req.body;

    if (!_id) {
      return res.status(400).json({ message: "Article ID is required" });
    }
    if (!title || !description || !category) {
      return res
        .status(400)
        .json({ message: "Title, description, and category are required" });
    }

    const existingArticle = await Article.findById(_id);
    if (!existingArticle) {
      return res.status(404).json({ message: "Article not found" });
    }

    const updateData = {
      title,
      description,
      category,
      ...(author && { author }),
      ...(image && { image }),
      ...(url && { url }),
      ...(uid && uid !== existingArticle.uid && { uid }),
      updatedAt: new Date(),
    };

    const updatedArticle = await Article.findByIdAndUpdate(_id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      message: "Article updated successfully",
      article: updatedArticle,
    });
  } catch (error) {
    console.error("Error updating article:", error);
    res.status(500).json({
      message: "Error updating article",
      error: error.message,
    });
  }
};

const deleteArticle = async (req, res) => {
  try {
    const { _id } = req.body;

    if (!_id) {
      return res.status(400).json({ message: "ID is required" });
    }

    const deletedArticle = await Article.findByIdAndDelete(_id);

    res.status(200).json({
      message: "Article deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting Article",
      error: error.message,
    });
  }
};

const listArticles = async (req, res) => {
  try {
    const articles = await Article.find({});

    if (!articles || articles.length === 0) {
      return res.status(404).json({ message: "No articles found." });
    }

    res.status(200).json(articles);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error getting articles", error: error.message });
  }
};

module.exports = {
  adminProfile,
  createUser,
  updateUser,
  deleteUser,
  dashboard,
  listUsers,
  addArticle,
  listArticles,
  updateArticle,
  deleteArticle,
};
