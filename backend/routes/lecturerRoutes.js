const express = require("express");
const router = express.Router();
const {
  lecturerProfile,
  listCourseUsers,
} = require("../controllers/lecturerController");

router.get("/", lecturerProfile);

router.post("/listCourseUsers", listCourseUsers);

module.exports = router;
