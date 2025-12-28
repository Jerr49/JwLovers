const User = require("../models/User.model");
const Profile = require("../models/Profile.model");
const validator = require("validator");

// Get current user (private data)
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          phoneNumber: user.phoneNumber,
          isEmailVerified: user.isEmailVerified,
          isPhoneVerified: user.isPhoneVerified,
          notificationSettings: user.notificationSettings,
          lastLogin: user.lastLogin,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }
      },
    });
  } catch (error) {
    console.error("Get me error:", error);
    res.status(500).json({
      success: false,
      error: "Unable to retrieve user information",
    });
  }
};

// Update private user info
exports.updatePrivateInfo = async (req, res) => {
  try {
    const { firstName, lastName, phoneNumber } = req.body;

    const updateData = {};
    if (firstName !== undefined) updateData.firstName = firstName.trim();
    if (lastName !== undefined) updateData.lastName = lastName.trim();
    
    if (phoneNumber !== undefined) {
      if (!validator.isMobilePhone(phoneNumber)) {
        return res.status(400).json({
          success: false,
          error: "Please provide a valid phone number"
        });
      }
      updateData.phoneNumber = phoneNumber.trim();
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        error: "No data provided to update"
      });
    }

    const user = await User.findByIdAndUpdate(req.userId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    res.json({
      success: true,
      message: "Private information updated successfully",
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          phoneNumber: user.phoneNumber,
          updatedAt: user.updatedAt
        }
      }
    });
  } catch (error) {
    console.error("Update private info error:", error);

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        error: errors.join(", "),
      });
    }

    res.status(500).json({
      success: false,
      error: "Unable to update private information",
    });
  }
};

// Change password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        error: "Current password and new password are required",
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        error: "New password must be at least 8 characters long",
      });
    }

    const user = await User.findById(req.userId).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: "Current password is incorrect",
      });
    }

    user.password = newPassword;
    await user.save();

    // Clear refresh token for security
    await User.findByIdAndUpdate(
      req.userId,
      { refreshToken: null },
      { new: true, runValidators: false }
    );

    res.json({
      success: true,
      message: "Password changed successfully. Please login again.",
    });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({
      success: false,
      error: "Unable to change password",
    });
  }
};

// Update email
exports.updateEmail = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Email and password are required"
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        error: "Please provide a valid email address"
      });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ 
      email: email.toLowerCase().trim(),
      _id: { $ne: req.userId }
    });
    
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: "Email already in use"
      });
    }

    const user = await User.findById(req.userId).select("+password");
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found"
      });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: "Password is incorrect"
      });
    }

    user.email = email.toLowerCase().trim();
    user.isEmailVerified = false; // Require re-verification
    await user.save();

    res.json({
      success: true,
      message: "Email updated successfully. Please verify your new email.",
      data: {
        email: user.email,
        isEmailVerified: user.isEmailVerified
      }
    });
  } catch (error) {
    console.error("Update email error:", error);
    res.status(500).json({
      success: false,
      error: "Unable to update email"
    });
  }
};

// Delete account
exports.deleteAccount = async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        success: false,
        error: "Password is required to delete account"
      });
    }

    const user = await User.findById(req.userId).select("+password");
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found"
      });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: "Password is incorrect"
      });
    }

    // Soft delete user
    user.isActive = false;
    user.deactivatedAt = new Date();
    user.email = `deleted_${Date.now()}_${user.email}`;
    user.refreshToken = null;
    await user.save();

    // Soft delete profile
    await Profile.findOneAndUpdate(
      { user: req.userId },
      {
        username: `deleted_${Date.now()}_${user.username}`,
        bio: 'This profile has been deleted',
        photos: [],
        isActive: false
      }
    );

    res.clearCookie("token");
    res.json({
      success: true,
      message: "Account deleted successfully"
    });
  } catch (error) {
    console.error("Delete account error:", error);
    res.status(500).json({
      success: false,
      error: "Unable to delete account"
    });
  }
};

// Get user settings
exports.getSettings = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('notificationSettings privacySettings');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found"
      });
    }

    res.json({
      success: true,
      data: {
        notificationSettings: user.notificationSettings,
        privacySettings: user.privacySettings
      }
    });
  } catch (error) {
    console.error("Get settings error:", error);
    res.status(500).json({
      success: false,
      error: "Unable to get settings"
    });
  }
};

// Update settings
exports.updateSettings = async (req, res) => {
  try {
    const { notificationSettings, privacySettings } = req.body;
    
    const updateData = {};
    if (notificationSettings) updateData.notificationSettings = notificationSettings;
    if (privacySettings) updateData.privacySettings = privacySettings;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        error: "No settings provided to update"
      });
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      updateData,
      { new: true }
    );

    res.json({
      success: true,
      message: "Settings updated successfully",
      data: {
        notificationSettings: user.notificationSettings,
        privacySettings: user.privacySettings
      }
    });
  } catch (error) {
    console.error("Update settings error:", error);
    res.status(500).json({
      success: false,
      error: "Unable to update settings"
    });
  }
};