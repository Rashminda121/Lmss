const lecturerProfile = (req, res) => {
  res.send("lecturer profile details");
};

const createUser = (req, res) => {
  res.send("lecturer creates a new user");
};

const updateUser = (req, res) => {
  res.send("lecturer updates the user");
};

const deleteUser = (req, res) => {
  res.send("lecturer deletes the user");
};

module.exports = {
  lecturerProfile,
  createUser,
  updateUser,
  deleteUser,
};
