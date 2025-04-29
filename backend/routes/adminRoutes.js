const express = require("express");
const router = express.Router();
const {
  adminProfile,
  createUser,
  updateUser,
  deleteUser,
  dashboard,
  listUsers,
  addArticle,
  listArticles,
  updateArticle,
  deleteArticle,
  listCourses,
  listCourseCategories,
  updateCourse,
  deleteCourse,
  updateCoursePublish,
  updateDiscussion,
  deleteDiscussion,
  addDiscussion,
  listDiscussions,
  listEvents,
  updateEvent,
  deleteEvent,
  addEvent,
} = require("../controllers/adminController");

router.get("/", adminProfile);

router.post("/create-user", createUser);
router.put("/update-user", updateUser);
router.delete("/deleteUser", deleteUser);

router.get("/dashboard", dashboard);
router.get("/listUsers", listUsers);
router.post("/addArticle", addArticle);
router.get("/listArticles", listArticles);
router.put("/updateArticle", updateArticle);
router.delete("/deleteArticle", deleteArticle);

router.put("/updateUser", updateUser);

router.get("/listCourses", listCourses);
router.get("/listCourseCategories", listCourseCategories);
router.put("/updateCourse", updateCourse);
router.delete("/deleteCourse", deleteCourse);
router.put("/updateCoursePublish", updateCoursePublish);

router.post("/addDiscussion", addDiscussion);
router.post("/updateDiscussion", updateDiscussion);
router.delete("/deleteDiscussion", deleteDiscussion);
router.get("/listDiscussions", listDiscussions);

router.get("/listEvents", listEvents);
router.post("/addEvent", addEvent);
router.post("/updateEvent", updateEvent);
router.delete("/deleteEvent", deleteEvent);

module.exports = router;
