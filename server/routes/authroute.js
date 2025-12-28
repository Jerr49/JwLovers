const express = require("express");
const router = express.Router();
const authController = require("../controllers/authcontroller");
const { protect } = require("../middleware/authmiddleware");

// Public routes
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/refresh-token", authController.refreshToken);

// Protected routes
router.get("/me", protect, authController.getMe);
router.post("/logout", protect, authController.logout);
router.put("/change-password", protect, authController.changePassword);
router.put("/update-private", protect, authController.updatePrivateInfo);

module.exports = router;