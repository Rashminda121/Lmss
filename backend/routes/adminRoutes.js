const express = require("express");
const router = express.Router();
const {
  adminProfile,
  createUser,
  updateUser,
  deleteUser,
  dashboard,
  listUsers,
} = require("../controllers/adminController");

router.get("/", adminProfile);

router.post("/create-user", createUser);
router.put("/update-user", updateUser);
router.delete("/delete-user", deleteUser);

router.get("/dashboard", dashboard);
router.get("/listUsers", listUsers);

module.exports = router;
