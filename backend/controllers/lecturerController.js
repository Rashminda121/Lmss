const User = require("../models/userModel");

const lecturerProfile = (req, res) => {
  res.send("lecturer profile details");
};

const listCourseUsers = async (req, res) => {
  try {
    const { userIds } = req.body;

    if (!Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ message: "userIds array is required." });
    }

    const users = await User.find({ uid: { $in: userIds } }).select(
      "uid name email image role -_id"
    );

    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No matching users found." });
    }

    return res.status(200).json(users);
  } catch (error) {
    console.error("Error getting users:", error);
    return res.status(500).json({
      message: "Error getting users",
      error: error.message,
    });
  }
};

module.exports = {
  lecturerProfile,
  listCourseUsers,
};
