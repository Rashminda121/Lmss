const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/", userController.userProfile);

router.post("/addUser", userController.addUser);
router.put("/updateUser", userController.updateUser);
router.delete("/deleteUser", userController.deleteUser);

module.exports = router;
