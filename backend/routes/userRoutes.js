const express = require("express");
const router = express.Router();
const {
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
  addEventComment,
  viewEventComments,
  editDisComment,
  editEventComment,
  deleteDisComment,
  deleteEventComment,
  addCourseQuestion,
  updateCourseQuestion,
  deleteCourseQuestion,
  viewCourseQuestions,
  addAnswerToCourseQuestion,
  updateCourseQuestionAnswer,
  deleteCourseQuestionAnswer,
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
router.get("/listEvents", listEvents);
router.post("/viewEvent", viewEvent);
router.put("/updateEvent", updateEvent);
router.delete("/deleteEvent", deleteEvent);

router.post("/addDisComment", addDisComment);
router.post("/viewdisComments", viewDisComments);
router.put("/editDisComment", editDisComment);
router.delete("/deleteDisComment", deleteDisComment);

router.post("/addEventComment", addEventComment);
router.put("/editEventComment", editEventComment);
router.post("/viewEventComments", viewEventComments);
router.delete("/deleteEventComment", deleteEventComment);

router.post("/addCourseQuestion", addCourseQuestion);
router.post("/viewCourseQuestions", viewCourseQuestions);
router.put("/updateCourseQuestion", updateCourseQuestion);
router.delete("/deleteCourseQuestion", deleteCourseQuestion);

router.post("/addAnswerToCourseQuestion", addAnswerToCourseQuestion);
router.put("/updateCourseQuestionAnswer", updateCourseQuestionAnswer);
router.delete("/deleteCourseQuestionAnswer", deleteCourseQuestionAnswer);

module.exports = router;
