const userProfile = (req, res) => {
  res.send("User profile details");
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

module.exports = {
  userProfile,
  createUser,
  updateUser,
  deleteUser,
};
