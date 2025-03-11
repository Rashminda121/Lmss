const User = require("../models/userModel");

const userProfile = (req, res) => {
  res.send("User profile details");
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

module.exports = {
  userProfile,
  addUser,
  updateUser,
  deleteUser,
};
