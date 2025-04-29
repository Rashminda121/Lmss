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

const updateUser = async (req, res) => {
  try {
    const { _id, name, phone, image, role, address } = req.body;

    if (!_id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    if (!name || !role) {
      return res.status(400).json({ message: "Name and role are required" });
    }

    const allowedRoles = ["admin", "student", "lecturer"];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role specified" });
    }

    const existingUser = await User.findById(_id);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const updateData = {
      name,
      phone: phone || existingUser.phone,
      image: image || existingUser.image,
      role,
      address: address || existingUser.address,
      updatedAt: new Date(),
    };

    const updatedUser = await User.findByIdAndUpdate(_id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({
      message: "Error updating user",
      error: error.message,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { _id } = req.body;

    if (!_id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const deletedUser = await User.findByIdAndDelete(_id);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User deleted successfully",
      userId: _id,
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({
      message: "Error deleting user",
      error: error.message,
    });
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

const updateCourse = async (req, res) => {
  try {
    const { id, categoryId, isPublished, title, description, imageUrl } =
      req.body;

    if (!id) {
      return res.status(400).json({ message: "Course ID is required" });
    }
    if (!title || !description || !categoryId) {
      return res.status(400).json({
        message: "Title, description, and category are required",
      });
    }

    const mysqlConnection = await connectMysqlDB();

    // First check if course exists
    const [existingCourses] = await mysqlConnection.execute(
      `SELECT * FROM course WHERE id = ?`,
      [id]
    );

    if (existingCourses.length === 0) {
      await mysqlConnection.end();
      return res.status(404).json({ message: "Course not found" });
    }

    // Prepare the update data
    const updateData = {
      title,
      description,
      categoryId,
      isPublished: isPublished ? 1 : 0, // Convert boolean to MySQL tinyint
      imageUrl,
      updatedAt: new Date(),
    };

    // Execute the update
    await mysqlConnection.execute(
      `UPDATE course
       SET title = ?, description = ?, categoryId = ?, 
           isPublished = ?, imageUrl = ?, updatedAt = ?
       WHERE id = ?`,
      [
        updateData.title,
        updateData.description,
        updateData.categoryId,
        updateData.isPublished,
        updateData.imageUrl,
        updateData.updatedAt,
        id,
      ]
    );

    await mysqlConnection.end();

    res.status(200).json({
      message: "Course updated successfully",
      course: {
        id,
        ...updateData,
        isPublished: Boolean(updateData.isPublished),
      },
    });
  } catch (error) {
    console.error("Error updating course:", error);
    res.status(500).json({
      message: "Error updating course",
      error: error.message,
    });
  }
};

const updateCoursePublish = async (req, res) => {
  try {
    const { id, isPublished, updatedAt } = req.body;

    if (!id) {
      return res.status(400).json({ message: "Course ID is required" });
    }

    const mysqlConnection = await connectMysqlDB();

    // First check if course exists
    const [existingCourses] = await mysqlConnection.execute(
      `SELECT * FROM course WHERE id = ?`,
      [id]
    );

    if (existingCourses.length === 0) {
      await mysqlConnection.end();
      return res.status(404).json({ message: "Course not found" });
    }

    const updateData = {
      isPublished: isPublished ? 1 : 0,
      updatedAt: new Date(),
    };

    // Execute the update
    await mysqlConnection.execute(
      `UPDATE course 
       SET isPublished = ?, updatedAt = ?
       WHERE id = ?`,
      [updateData.isPublished, updateData.updatedAt, id]
    );

    await mysqlConnection.end();

    res.status(200).json({
      message: "Course toggle updated successfully",
    });
  } catch (error) {
    console.error("Error updating course:", error);
    res.status(500).json({
      message: "Error updating course",
      error: error.message,
    });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ message: "Course ID is required" });
    }

    const mysqlConnection = await connectMysqlDB();

    // First check if course exists
    const [existingCourses] = await mysqlConnection.execute(
      `SELECT * FROM course WHERE id = ?`,
      [id]
    );

    if (existingCourses.length === 0) {
      await mysqlConnection.end();
      return res.status(404).json({ message: "Course not found" });
    }

    await mysqlConnection.beginTransaction();

    try {
      await mysqlConnection.execute(`DELETE FROM chapter WHERE courseId = ?`, [
        id,
      ]);

      await mysqlConnection.execute(`DELETE FROM course WHERE id = ?`, [id]);

      await mysqlConnection.commit();

      res.status(200).json({
        message: "Course and all associated chapters deleted successfully",
      });
    } catch (error) {
      await mysqlConnection.rollback();
      throw error;
    } finally {
      await mysqlConnection.end();
    }
  } catch (error) {
    console.error("Error deleting course:", error);
    res.status(500).json({
      message: "Error deleting course",
      error: error.message,
    });
  }
};

const listCourses = async (req, res) => {
  try {
    const mysqlConnection = await connectMysqlDB();
    const [courses] = await mysqlConnection.execute("SELECT * FROM course");

    await mysqlConnection.end();

    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({
      message: "Error getting courses",
      error: error.message,
    });
  }
};
const listCourseCategories = async (req, res) => {
  try {
    const mysqlConnection = await connectMysqlDB();
    const [category] = await mysqlConnection.execute("SELECT * FROM category");

    await mysqlConnection.end();

    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({
      message: "Error getting category",
      error: error.message,
    });
  }
};

const addDiscussion = async (req, res) => {
  try {
    const { title, description, email, category } = req.body;

    if (!title || !description || !email) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Create a new discussion
    const newDiscussion = new Discussion({
      uid: existingUser.uid,
      uimage: existingUser.image,
      name: existingUser.name,
      role: existingUser.role,
      title,
      description,
      category,
      email,
    });
    await newDiscussion.save();

    res.status(201).json({ message: "Discussion added successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding discussion", error: error.message });
  }
};

const updateDiscussion = async (req, res) => {
  try {
    const { _id, title, description, category, email } = req.body;

    if (!title || !description || !_id || !category || !email) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const updatedDiscussion = await Discussion.findByIdAndUpdate(
      _id,
      {
        title,
        description,
        category,
        email,
      },
      { new: true }
    );

    if (!updatedDiscussion) {
      return res.status(404).json({ message: "Discussion not found" });
    }

    res.status(200).json({
      message: "Discussion updated successfully",
      discussion: updatedDiscussion,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating discussion",
      error: error.message,
    });
  }
};
const deleteDiscussion = async (req, res) => {
  try {
    const { _id } = req.body;

    if (!_id) {
      return res.status(400).json({ message: "ID is required" });
    }

    const deletedDiscussion = await Discussion.findByIdAndDelete(_id);

    res.status(200).json({
      message: "Discussion deleted successfully",
      discussion: deletedDiscussion,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting discussion",
      error: error.message,
    });
  }
};

const listDiscussions = async (req, res) => {
  try {
    const discussions = await Discussion.find({});

    if (!discussions || discussions.length === 0) {
      return res.status(404).json({ message: "No discussions found." });
    }

    const updatedDiscussions = await Promise.all(
      discussions.map(async (discussion) => {
        const count = await DisComment.countDocuments({
          disid: discussion._id,
        });
        discussion.comments = count;
        await discussion.save();

        return discussion;
      })
    );

    res.status(200).json(updatedDiscussions);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error getting discussions", error: error.message });
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
  listCourses,
  listCourseCategories,
  updateCourse,
  deleteCourse,
  updateCoursePublish,
  updateDiscussion,
  deleteDiscussion,
  addDiscussion,
  listDiscussions,
};
