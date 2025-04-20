const express = require("express");
const router = express.Router();
const {
  userProfile,
  addUser,
  updateUser,
  deleteUser,
  addDiscussion,
} = require("../controllers/userController");

router.get("/userProfile", userProfile);

router.post("/addUser", addUser);
router.put("/updateUser", updateUser);
router.delete("/deleteUser", deleteUser);

router.post("/addDiscussion", addDiscussion);

module.exports = router;
