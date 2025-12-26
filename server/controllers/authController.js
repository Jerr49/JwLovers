const User = require("../models/User.model");
const Profile = require("../models/Profile.model");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require('crypto');

// ============================================
// ✅ Token Generation Functions
// ============================================

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

const generateRefreshToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "30d",
  });
};

const sendTokenResponse = async (user, statusCode, res) => {
  try {
    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    await User.findByIdAndUpdate(
      user._id,
      { 
        refreshToken, 
        lastLogin: new Date(),
        loginAttempts: 0,
        lockUntil: undefined
      },
      { new: true, runValidators: false }
    );

    const cookieOptions = {
      expires: new Date(
        Date.now() + (process.env.JWT_COOKIE_EXPIRE || 7) * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    };

    const profile = await Profile.findOne({ user: user._id })
      .select('username profilePicture profileCompletion isVerified');

    res
      .status(statusCode)
      .cookie("token", token, cookieOptions)
      .json({
        success: true,
        token,
        refreshToken,
        data: {
          user: {
            id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            isEmailVerified: user.isEmailVerified,
            lastLogin: user.lastLogin,
          },
          profile: profile ? {
            username: profile.username,
            profilePicture: profile.profilePicture,
            profileCompletion: profile.profileCompletion,
            isVerified: profile.isVerified
          } : null
        },
      });
  } catch (error) {
    console.error("Send token response error:", error);
    throw error;
  }
};

// ============================================
// ✅ Authentication Controllers
// ============================================

exports.register = async (req, res) => {
  const session = await User.startSession();
  session.startTransaction();
  
  try {
    const { email, password, firstName, lastName, phoneNumber, username } = req.body;

    // Validation
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({
        success: false,
        error: "Email, password, first name, and last name are required"
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        error: "Please provide a valid email address"
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        error: "Password must be at least 8 characters long"
      });
    }

    // Check existing user
    const existingUser = await User.findOne({ 
      email: email.toLowerCase().trim() 
    }).session(session);
    
    if (existingUser) {
      await session.abortTransaction();
      session.endSession();
      
      return res.status(400).json({
        success: false,
        error: "Email already exists"
      });
    }

    // Check username if provided
    if (username) {
      const existingProfile = await Profile.findOne({ 
        username: username.trim().toLowerCase() 
      }).session(session);
      
      if (existingProfile) {
        await session.abortTransaction();
        session.endSession();
        
        return res.status(400).json({
          success: false,
          error: "Username already exists"
        });
      }
    }

    // ✅ FIXED: Hash password manually
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with pre-hashed password
    const user = await User.create([{
      email: email.toLowerCase().trim(),
      password: hashedPassword, // Already hashed
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phoneNumber: phoneNumber ? phoneNumber.trim() : null,
      passwordChangedAt: Date.now() - 1000
    }], { session });

    // Create empty profile
    const profile = await Profile.create([{
      user: user[0]._id,
      username: username ? username.trim().toLowerCase() : `user_${user[0]._id.toString().slice(-6)}`,
      relationshipStatus: 'single',
      lookingFor: 'not-sure',
      haveChildren: 'no'
    }], { session });

    await session.commitTransaction();
    session.endSession();

    console.log("✅ User registered:", user[0]._id);

    await sendTokenResponse(user[0], 201, res);
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    session.endSession();
    
    console.error("❌ Registration error:", error);

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        error: errors.join(", "),
      });
    }

    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        success: false,
        error: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`,
      });
    }

    res.status(500).json({
      success: false,
      error: "Registration failed. Please try again.",
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Please provide email and password",
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password"
      });
    }

    // ✅ FIXED: Use bcrypt.compare directly
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password",
      });
    }

    await sendTokenResponse(user, 200, res);
  } catch (error) {
    console.error("Login error:", error);

    const errorMessage = process.env.NODE_ENV === "production"
      ? "Login failed. Please check your credentials."
      : error.message;

    res.status(500).json({
      success: false,
      error: errorMessage,
    });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    const profile = await Profile.findOne({ user: req.userId });

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
        },
        profile: profile ? {
          username: profile.username,
          profilePicture: profile.profilePicture,
          bio: profile.bio,
          age: profile.age,
          gender: profile.gender,
          profileCompletion: profile.profileCompletion,
          isVerified: profile.isVerified
        } : null
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

exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        error: "Refresh token is required",
      });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    const user = await User.findOne({
      _id: decoded.userId,
      refreshToken: refreshToken,
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Invalid refresh token",
      });
    }

    const newToken = generateToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);

    await User.findByIdAndUpdate(
      user._id,
      { refreshToken: newRefreshToken },
      { new: true, runValidators: false }
    );

    res.json({
      success: true,
      data: {
        token: newToken,
        refreshToken: newRefreshToken,
      },
    });
  } catch (error) {
    console.error("Refresh token error:", error);

    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return res.status(401).json({
        success: false,
        error: "Invalid or expired refresh token",
      });
    }

    res.status(500).json({
      success: false,
      error: "Unable to refresh token",
    });
  }
};

exports.logout = async (req, res) => {
  try {
    res.clearCookie("token");

    if (req.userId) {
      await User.findByIdAndUpdate(
        req.userId,
        { refreshToken: null },
        { new: true, runValidators: false }
      );
    }

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.clearCookie("token");
    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  }
};

// ============================================
// ✅ Additional Security Controllers
// ============================================

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

    // ✅ FIXED: Use bcrypt.compare directly
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: "Current password is incorrect",
      });
    }

    // ✅ Hash new password manually
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Update user
    user.password = hashedPassword;
    user.passwordChangedAt = Date.now();
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

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: "Email is required"
      });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      return res.json({
        success: true,
        message: "If your email exists, you will receive a reset link"
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    user.passwordResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
      
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    console.log(`Password reset token for ${user.email}: ${resetToken}`);

    res.json({
      success: true,
      message: "Password reset instructions sent to your email"
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({
      success: false,
      error: "Unable to process password reset request"
    });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({
        success: false,
        error: "Token and new password are required"
      });
    }

    // Hash token to compare with stored hash
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // Find user with valid reset token
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        error: "Invalid or expired reset token"
      });
    }

    // ✅ Hash new password manually
    const hashedPassword = await bcrypt.hash(password, 10);
    
    user.password = hashedPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.refreshToken = null;
    user.passwordChangedAt = Date.now();
    
    await user.save();

    res.json({
      success: true,
      message: "Password reset successful. Please login with your new password."
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({
      success: false,
      error: "Unable to reset password"
    });
  }
};

exports.updatePrivateInfo = async (req, res) => {
  try {
    const { firstName, lastName, phoneNumber } = req.body;

    const updateData = {};
    if (firstName !== undefined) updateData.firstName = firstName.trim();
    if (lastName !== undefined) updateData.lastName = lastName.trim();
    
    if (phoneNumber !== undefined) {
      if (phoneNumber && !validator.isMobilePhone(phoneNumber)) {
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

exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        error: "Verification token is required"
      });
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      { isEmailVerified: true },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found"
      });
    }

    await Profile.findOneAndUpdate(
      { user: req.userId },
      { 
        $addToSet: { verificationBadges: 'email' },
        isVerified: true
      }
    );

    res.json({
      success: true,
      message: "Email verified successfully"
    });
  } catch (error) {
    console.error("Verify email error:", error);
    res.status(500).json({
      success: false,
      error: "Unable to verify email"
    });
  }
};