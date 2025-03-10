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

module.exports = {
  adminProfile,
  createUser,
  updateUser,
  deleteUser,
};
