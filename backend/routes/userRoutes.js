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
  deleteDiscussion,
  addEvent,
} = require("../controllers/userController");

router.get("/userProfile", userProfile);

router.post("/addUser", addUser);
router.put("/updateUser", updateUser);
router.delete("/deleteUser", deleteUser);

router.post("/addDiscussion", addDiscussion);
router.post("/updateDiscussion", updateDiscussion);
router.delete("/deleteDiscussion", deleteDiscussion);
router.get("/listDiscussions", listDiscussions);
router.post("/viewDiscussion", viewDiscussion);

router.post("/addEvent", addEvent);

module.exports = router;
