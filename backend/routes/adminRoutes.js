const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

router.get("/", adminController.adminProfile);

router.post("/create-user", adminController.createUser);
router.put("/update-user", adminController.updateUser);
router.delete("/delete-user", adminController.deleteUser);

module.exports = router;
