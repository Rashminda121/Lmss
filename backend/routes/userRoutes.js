const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/", userController.userProfile);

router.post("/create-user", userController.createUser);
router.put("/update-user", userController.updateUser);
router.delete("/delete-user", userController.deleteUser);

module.exports = router;
