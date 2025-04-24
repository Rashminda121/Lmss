const User = require("../models/userModel");
const Discussion = require("../models/discussionModel");
const Event = require("../models/eventModel");
const DisComment = require("../models/discussionCommentsModel");

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

const deleteDiscussion = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ message: "ID is required" });
    }

    const deletedDiscussion = await Discussion.findByIdAndDelete(id);

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

const addEvent = async (req, res) => {
  try {
    const {
      uid,
      title,
      date,
      time,
      location,
      description,
      category,
      type,
      url,
      image,
    } = req.body;

    const requiredFields = [
      uid,
      title,
      date,
      location,
      description,
      category,
      type,
      image,
    ];

    if (requiredFields.some((field) => !field)) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user exists
    const existingUser = await User.findOne({ uid: uid });
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Create a new event
    const newEvent = new Event({
      uid,
      title,
      date,
      time,
      location,
      description,
      category,
      type,
      url,
      image,
    });
    await newEvent.save();

    res.status(201).json({ message: "Event added successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding event", error: error.message });
  }
};

const listEvents = async (req, res) => {
  try {
    const events = await Event.find({});

    if (!events || events.length === 0) {
      return res.status(404).json({ message: "No events found." });
    }

    res.status(200).json(events);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error getting events", error: error.message });
  }
};

const viewEvent = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ message: "Missing event ID." });
    }
    const event = await Event.findOne({ _id: id });

    if (!event || event.length === 0) {
      return res.status(404).json({ message: "No events found." });
    }

    res.status(200).json(event);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error getting events", error: error.message });
  }
};

const updateEvent = async (req, res) => {
  try {
    const {
      _id,
      title,
      date,
      location,
      coordinates,
      description,
      category,
      type,
      url,
      image,
    } = req.body;

    // Validate required fields
    if (
      !_id ||
      !title ||
      !date ||
      !location ||
      !description ||
      !category ||
      !type
    ) {
      return res.status(400).json({
        message: "Missing required fields.",
      });
    }

    // Validate date format if needed
    if (isNaN(new Date(date).getTime())) {
      return res.status(400).json({ message: "Invalid date format" });
    }

    // Prepare update object
    const updateData = {
      title,
      date: new Date(date),
      location,
      coordinates: coordinates || {},
      description,
      category,
      type,
      url: url || "",
      image: image || "",
      updatedAt: new Date(),
    };

    const updatedEvent = await Event.findByIdAndUpdate(_id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json({
      message: "Event updated successfully",
      event: updatedEvent,
    });
  } catch (error) {
    console.error("Error updating event:", error);
    res.status(500).json({
      message: "Error updating event",
      error: error.message,
    });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ message: "ID is required" });
    }

    const deletedEvent = await Event.findByIdAndDelete(id);

    res.status(200).json({
      message: "Event deleted successfully",
      event: deletedEvent,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting event",
      error: error.message,
    });
  }
};

const addComment = async (req, res) => {
  try {
    const { disid, uid, uimage, name, description, email } = req.body;

    if (!disid || !description) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Create a new comment
    const newComment = new DisComment({
      disid,
      uid,
      uimage,
      name,
      description,
      email,
    });
    await newComment.save();

    res.status(201).json({ message: "Comment added successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding comment", error: error.message });
  }
};

const viewComments = async (req, res) => {
  try {
    const { disid } = req.body;

    if (!disid) {
      return res.status(400).json({ message: "ID is required" });
    }

    const comments = await DisComment.find({ disid });

    if (!comments || comments.length === 0) {
      return res.status(404).json({ message: "No comments found." });
    }

    res.status(200).json(comments);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error getting comments", error: error.message });
  }
};

const editComment = async (req, res) => {
  try {
    const { _id, description } = req.body;

    // Validate required fields
    if (!_id || !description) {
      return res.status(400).json({
        message: "Missing required fields.",
      });
    }

    // Prepare update object
    const updateData = {
      description,
    };

    const updateComment = await DisComment.findByIdAndUpdate(_id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updateComment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    res.status(200).json({
      message: "Comment updated successfully",
      Comment: updateComment,
    });
  } catch (error) {
    console.error("Error updating comment:", error);
    res.status(500).json({
      message: "Error updating comment",
      error: error.message,
    });
  }
};

const deleteComment = async (req, res) => {
  try {
    const { _id } = req.body;

    if (!_id) {
      return res.status(400).json({ message: "ID is required" });
    }

    const deletedComment = await DisComment.findByIdAndDelete(_id);

    res.status(200).json({
      message: "Comment deleted successfully",
      comment: deletedComment,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting comment",
      error: error.message,
    });
  }
};

module.exports = {
  userProfile,
  addUser,
  updateUser,
  deleteUser,
  addDiscussion,
  updateDiscussion,
  deleteDiscussion,
  listDiscussions,
  viewDiscussion,
  addEvent,
  listEvents,
  viewEvent,
  updateEvent,
  deleteEvent,
  addComment,
  viewComments,
  editComment,
  deleteComment,
};
