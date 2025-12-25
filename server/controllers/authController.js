const User = require("../models/User");
const jwt = require("jsonwebtoken");
const validator = require("validator");

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

// Generate Refresh Token
const generateRefreshToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "30d",
  });
};

// Send Token Response
const sendTokenResponse = async (user, statusCode, res) => {
  try {
    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Store refresh token
    await User.findByIdAndUpdate(
      user._id,
      { refreshToken, lastLogin: new Date() },
      { new: true, runValidators: false }
    );

    // Cookie options
    const cookieOptions = {
      expires: new Date(
        Date.now() + (process.env.JWT_COOKIE_EXPIRE || 7) * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    };

    // Return response
    res
      .status(statusCode)
      .cookie("token", token, cookieOptions)
      .json({
        success: true,
        token,
        refreshToken,
        data: {
          user: user.toJSON
            ? user.toJSON()
            : {
                id: user._id,
                email: user.email,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                lastLogin: user.lastLogin,
                createdAt: user.createdAt,
              },
        },
      });
  } catch (error) {
    console.error("Send token response error:", error);
    throw error;
  }
};

// Register User
exports.register = async (req, res) => {
  try {
    const {
      email,
      password,
      username,
      firstName,
      lastName,
      dob,
      gender,
      country,
      city,
    } = req.body;

    // Validation
    if (!email || !password || !username || !firstName || !lastName) {
      return res.status(400).json({
        success: false,
        error:
          "Email, password, username, first name, and last name are required",
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        error: "Please provide a valid email address",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        error: "Password must be at least 8 characters long",
      });
    }

    if (username.length < 3 || username.length > 30) {
      return res.status(400).json({
        success: false,
        error: "Username must be between 3 and 30 characters",
      });
    }

    // Check existing user
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error:
          existingUser.email === email
            ? "Email already exists"
            : "Username already exists",
      });
    }

    // Create user
    const user = await User.create({
      email: email.toLowerCase().trim(),
      password,
      username: username.trim(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      dob,
      gender,
      country: country ? country.trim() : country,
      city: city ? city.trim() : city,
    });

    console.log("✅ User created:", user._id);

    // Send response
    await sendTokenResponse(user, 201, res);
  } catch (error) {
    console.error("❌ Registration error:", error);

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        error: errors.join(", "),
      });
    }

    if (error.code === 11000) {
      const field = error.keyValue.email ? "Email" : "Username";
      return res.status(400).json({
        success: false,
        error: `${field} already exists`,
      });
    }

    res.status(500).json({
      success: false,
      error: "Registration failed. Please try again.",
    });
  }
};

// Login User
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
        error: "Invalid email or password",
      });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password",
      });
    }

    // Send response
    await sendTokenResponse(user, 200, res);
  } catch (error) {
    console.error("Login error:", error);

    const errorMessage =
      process.env.NODE_ENV === "production"
        ? "Login failed. Please check your credentials."
        : error.message;

    res.status(500).json({
      success: false,
      error: errorMessage,
    });
  }
};

// Get Current User
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
        user: user.toJSON
          ? user.toJSON()
          : {
              id: user._id,
              email: user.email,
              username: user.username,
              firstName: user.firstName,
              lastName: user.lastName,
              dob: user.dob,
              gender: user.gender,
              country: user.country,
              city: user.city,
              lastLogin: user.lastLogin,
              createdAt: user.createdAt,
              age: user.age,
            },
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

// Refresh Token
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

// Logout User - BEST PRACTICE
exports.logout = async (req, res) => {
  try {
    // 1. Clear HTTP cookies (if using cookies)
    res.clearCookie("token");

    // 2. Invalidate refresh token if user ID is available
    if (req.userId) {
      await User.findByIdAndUpdate(
        req.userId,
        { refreshToken: undefined },
        { new: true, runValidators: false }
      ).catch((err) => {
        // Silently fail - user might not exist or already logged out
        console.log("Optional logout cleanup:", err.message);
      });
    }

    // 3. ALWAYS return success (200 OK)
    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    // 4. Even on unexpected errors, clear cookies and return success
    res.clearCookie("token");
    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  }
};

// Update User Profile
exports.updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, dob, gender, country, city } = req.body;

    const updateData = {};
    if (firstName !== undefined) updateData.firstName = firstName.trim();
    if (lastName !== undefined) updateData.lastName = lastName.trim();
    if (dob !== undefined) updateData.dob = dob;
    if (gender !== undefined) updateData.gender = gender;
    if (country !== undefined) updateData.country = country.trim();
    if (city !== undefined) updateData.city = city.trim();

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
      message: "Profile updated successfully",
      data: {
        user: user.toJSON ? user.toJSON() : user,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        error: errors.join(", "),
      });
    }

    res.status(500).json({
      success: false,
      error: "Unable to update profile",
    });
  }
};

// Change Password
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

    // Invalidate refresh tokens after password change
    await User.findByIdAndUpdate(
      user._id,
      { refreshToken: undefined },
      { new: true, runValidators: false }
    );

    res.json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({
      success: false,
      error: "Unable to change password",
    });
  }
};
