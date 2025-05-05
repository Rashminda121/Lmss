const User = require("../models/userModel");
const Discussion = require("../models/discussionModel");
const Event = require("../models/eventModel");
const DisComment = require("../models/discussionCommentsModel");
const EventComment = require("../models/eventCommentsModel");
const jwt = require("jsonwebtoken");
const CourseQuestion = require("../models/courseQuestionsModel");

const userProfile = async (req, res) => {
  try {
    const { uid, email } = req.query;

    if (!uid) {
      return res.status(400).json({ message: "Missing user ID or email." });
    }
    let user = null;

    if (!email) {
      user = await User.findOne({ uid: uid }).select(
        "_id name email phone image role address createdAt updatedAt"
      );
    } else {
      user = await User.findOne({ uid: uid, email: email }).select(
        "_id name email phone image role address createdAt updatedAt"
      );
    }

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
    const token = jwt.sign({ id: uid }, process.env.JWT_SECRET);

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists", token });
    }

    const newUser = new User({ uid, name, email, image });
    await newUser.save();

    res.status(201).json({ message: "User added successfully", token });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating user", error: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { _id, name, phone, address, image } = req.body;

    if (!_id || !name) {
      return res.status(400).json({
        success: false,
        message: "User ID and name are required fields",
      });
    }

    const user = await User.findById(_id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.name = name || user.name;
    user.phone = phone || user.phone;
    user.address = address || user.address;
    user.image = image || user.image;
    user.updatedAt = Date.now();

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      message: "User profile updated successfully",
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating user profile",
      error: error.message,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { _id } = req.body;

    if (!_id) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const deletedUser = await User.findByIdAndDelete(_id);
    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User account deleted successfully",
      data: {
        _id: deletedUser._id,
        email: deletedUser.email,
      },
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting user account",
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
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ message: "ID is required" });
    }

    const deletedDiscussion = await Discussion.findByIdAndDelete({ _id: id });

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

    const updatedEvents = await Promise.all(
      events.map(async (event) => {
        const commentCount = await EventComment.countDocuments({
          eid: event._id,
        });
        return {
          ...event.toObject(),
          comments: commentCount,
        };
      })
    );

    res.status(200).json(updatedEvents);
  } catch (error) {
    res.status(500).json({
      message: "Error getting events",
      error: error.message,
    });
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
      time,
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
      time,
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

const addDisComment = async (req, res) => {
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

const viewDisComments = async (req, res) => {
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

const editDisComment = async (req, res) => {
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

const deleteDisComment = async (req, res) => {
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

const addEventComment = async (req, res) => {
  try {
    const { eid, uid, uimage, name, text, email } = req.body;

    if (!eid || !text) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Create a new comment
    const newComment = new EventComment({
      eid,
      uid,
      uimage,
      name,
      text,
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

const editEventComment = async (req, res) => {
  try {
    const { _id, text } = req.body;

    // Validate required fields
    if (!_id || !text) {
      return res.status(400).json({
        message: "Missing required fields.",
      });
    }

    // Prepare update object
    const updateData = {
      text,
    };

    const updateComment = await EventComment.findByIdAndUpdate(
      _id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

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
const deleteEventComment = async (req, res) => {
  try {
    const { _id } = req.body;

    if (!_id) {
      return res.status(400).json({ message: "ID is required" });
    }

    const deletedComment = await EventComment.findByIdAndDelete(_id);

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

const viewEventComments = async (req, res) => {
  try {
    const { eid } = req.body;

    if (!eid) {
      return res.status(400).json({ message: "ID is required" });
    }

    const comments = await EventComment.find({ eid });

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

const addCourseQuestion = async (req, res) => {
  try {
    const { userId, courseId, chapterId, text, uname } = req.body;

    if (!userId || !text || !courseId || !chapterId) {
      return res.status(400).json({
        success: false,
        message: "UserId, text, courseId, and chapterId are required fields",
      });
    }

    const newQuestion = new CourseQuestion({
      userId,
      courseId,
      chapterId,
      uname: uname || "Anonymous",
      text,
      answers: [],
    });

    await newQuestion.save();

    res.status(201).json({
      success: true,
      message: "Question added successfully",
      question: newQuestion,
    });
  } catch (error) {
    console.error("Error adding question:", error);
    res.status(500).json({
      success: false,
      message: "Error adding question",
      error: error.message,
    });
  }
};

const updateCourseQuestion = async (req, res) => {
  try {
    const { _id, text } = req.body;

    if (!_id || !text) {
      return res.status(400).json({
        success: false,
        message: "Question ID and text are required",
      });
    }

    const updatedQuestion = await CourseQuestion.findByIdAndUpdate(
      _id,
      { text },
      { new: true, runValidators: true }
    );

    if (!updatedQuestion) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Question updated successfully",
      question: updatedQuestion,
    });
  } catch (error) {
    console.error("Error updating question:", error);
    res.status(500).json({
      success: false,
      message: "Error updating question",
      error: error.message,
    });
  }
};

const deleteCourseQuestion = async (req, res) => {
  try {
    const { _id } = req.body;

    if (!_id) {
      return res.status(400).json({
        success: false,
        message: "Question ID is required",
      });
    }

    const deletedQuestion = await CourseQuestion.findByIdAndDelete(_id);

    if (!deletedQuestion) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Question deleted successfully",
      question: deletedQuestion,
    });
  } catch (error) {
    console.error("Error deleting question:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting question",
      error: error.message,
    });
  }
};

const viewCourseQuestions = async (req, res) => {
  try {
    const { courseId, chapterId } = req.body;

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Course ID is required",
      });
    }

    // Build query based on provided parameters
    const query = { courseId };
    if (chapterId) {
      query.chapterId = chapterId;
    }

    const questions = await CourseQuestion.find(query)
      .sort({ createdAt: -1 })
      .populate("answers");

    if (!questions || questions.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No questions found",
        questions: [],
      });
    }

    res.status(200).json({
      success: true,
      message: "Questions retrieved successfully",
      questions,
    });
  } catch (error) {
    console.error("Error getting questions:", error);
    res.status(500).json({
      success: false,
      message: "Error getting questions",
      error: error.message,
    });
  }
};

const addAnswerToCourseQuestion = async (req, res) => {
  try {
    const { questionId, userId, text, uname } = req.body;

    // Validate required fields
    if (!questionId || !userId || !text) {
      return res.status(400).json({
        success: false,
        message: "questionId, userId, and text are required fields",
      });
    }

    // Create new answer object
    const newAnswer = {
      userId,
      uname: uname || "Anonymous",
      text,
      createdAt: new Date(),
    };

    // Find the question and add the answer
    const updatedQuestion = await CourseQuestion.findByIdAndUpdate(
      questionId,
      { $push: { answers: newAnswer } },
      { new: true, runValidators: true }
    );

    if (!updatedQuestion) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    res.status(201).json({
      success: true,
      message: "Answer added successfully",
      question: updatedQuestion,
    });
  } catch (error) {
    console.error("Error adding answer:", error);
    res.status(500).json({
      success: false,
      message: "Error adding answer",
      error: error.message,
    });
  }
};

const updateCourseQuestionAnswer = async (req, res) => {
  try {
    const { questionId, answerId, text } = req.body;

    // Validate required fields
    if (!questionId || !answerId || !text) {
      return res.status(400).json({
        success: false,
        message: "questionId, answerId, and text are required fields",
      });
    }

    // Find the question and update the specific answer
    const updatedQuestion = await CourseQuestion.findOneAndUpdate(
      {
        _id: questionId,
        "answers._id": answerId,
      },
      {
        $set: { "answers.$.text": text },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedQuestion) {
      return res.status(404).json({
        success: false,
        message: "Question or answer not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Answer updated successfully",
      question: updatedQuestion,
    });
  } catch (error) {
    console.error("Error updating answer:", error);
    res.status(500).json({
      success: false,
      message: "Error updating answer",
      error: error.message,
    });
  }
};

const deleteCourseQuestionAnswer = async (req, res) => {
  try {
    const { questionId, answerId } = req.body;

    // Validate required fields
    if (!questionId || !answerId) {
      return res.status(400).json({
        success: false,
        message: "questionId and answerId are required fields",
      });
    }

    // Find the question and pull (remove) the specific answer
    const updatedQuestion = await CourseQuestion.findByIdAndUpdate(
      { _id: questionId },
      {
        $pull: { answers: { _id: answerId } },
      },
      {
        new: true,
      }
    );

    if (!updatedQuestion) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Answer deleted successfully",
      question: updatedQuestion,
    });
  } catch (error) {
    console.error("Error deleting answer:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting answer",
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
  addDisComment,
  viewDisComments,
  editDisComment,
  deleteDisComment,
  addEventComment,
  editEventComment,
  deleteEventComment,
  viewEventComments,
  addCourseQuestion,
  updateCourseQuestion,
  deleteCourseQuestion,
  viewCourseQuestions,
  addAnswerToCourseQuestion,
  updateCourseQuestionAnswer,
  deleteCourseQuestionAnswer,
};
