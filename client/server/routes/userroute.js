const express = require("express");
const router = express.Router();
const userController = require("../controllers/usercontroller");
const { protect } = require("../middleware/authmiddleware");

// Protected routes
router.get("/me", protect, userController.getMe);
router.put("/update", protect, userController.updatePrivateInfo);
router.put("/change-password", protect, userController.changePassword);
router.put("/update-email", protect, userController.updateEmail);
router.delete("/delete", protect, userController.deleteAccount);
router.get("/settings", protect, userController.getSettings);
router.put("/settings", protect, userController.updateSettings);

module.exports = router;