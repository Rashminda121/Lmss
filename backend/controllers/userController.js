const User = require("../models/userModel");
const Discussion = require("../models/discussionModel");

const userProfile = async (req, res) => {
  try {
    const { uid, email } = req.query;

    if (!uid || !email) {
      return res.status(400).json({ message: "Missing user ID or email." });
    }

    const user = await User.findOne({ uid: uid, email: email }).select(
      "name email phone image role address updatedAt"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const addUser = async (req, res) => {
  try {
    const { uid, name, email, image } = req.body;

    if (!name || !email || !uid) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create a new user
    const newUser = new User({ uid, name, email, image });
    await newUser.save();

    res.status(201).json({ message: "User added successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating user", error: error.message });
  }
};

const updateUser = (req, res) => {
  res.send("User updates the user");
};

const deleteUser = (req, res) => {
  res.send("User deletes the user");
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

const listDiscussions = async (req, res) => {
  try {
    const discussions = await Discussion.find({});

    if (!discussions || discussions.length === 0) {
      return res.status(404).json({ message: "No discussions found." });
    }

    res.status(200).json(discussions);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error getting discussions", error: error.message });
  }
};
const viewDiscussion = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ message: "Missing discussion ID." });
    }
    const discussion = await Discussion.findOne({ _id: id });

    if (!discussion || discussion.length === 0) {
      return res.status(404).json({ message: "No discussions found." });
    }

    res.status(200).json(discussion);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error getting discussions", error: error.message });
  }
};

module.exports = {
  userProfile,
  addUser,
  updateUser,
  deleteUser,
  addDiscussion,
  updateDiscussion,
  listDiscussions,
  viewDiscussion,
};
