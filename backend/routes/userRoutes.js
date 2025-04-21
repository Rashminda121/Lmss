const express = require("express");
const router = express.Router();
const {
  userProfile,
  addUser,
  updateUser,
  deleteUser,
  addDiscussion,
  listDiscussions,
  viewDiscussion,
  updateDiscussion,
} = require("../controllers/userController");

router.get("/userProfile", userProfile);

router.post("/addUser", addUser);
router.put("/updateUser", updateUser);
router.delete("/deleteUser", deleteUser);

router.post("/addDiscussion", addDiscussion);
router.post("/updateDiscussion", updateDiscussion);
router.get("/listDiscussions", listDiscussions);
router.post("/viewDiscussion", viewDiscussion);

module.exports = router;
