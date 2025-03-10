const express = require("express");
const router = express.Router();
const lecturerController = require("../controllers/lecturerController");

router.get("/", lecturerController.lecturerProfile);

router.post("/create-user", lecturerController.createUser);
router.put("/update-user", lecturerController.updateUser);
router.delete("/delete-user", lecturerController.deleteUser);

module.exports = router;
