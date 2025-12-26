const jwt = require("jsonwebtoken");
const User = require("../models/User.model");

// Main authentication middleware
exports.protect = async (req, res, next) => {
  try {
    let token;

    // Get token from multiple sources
    token = getTokenFromRequest(req);

    if (!token) {
      return res.status(401).json({
        success: false,
        error: "Authentication required. Please login to access this resource.",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if user exists and is active
    const user = await User.findById(decoded.userId).select('_id email role isActive isVerified');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: "User account not found. Please login again.",
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        error: "Account deactivated. Please contact support.",
      });
    }

    // Attach user info to request
    req.userId = user._id;
    req.user = {
      id: user._id,
      email: user.email,
      role: user.role || 'user',
      isVerified: user.isVerified || false
    };
    
    next();
  } catch (error) {
    console.error("Auth middleware error:", error.message);

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        error: "Invalid authentication token.",
      });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        error: "Session expired. Please login again.",
      });
    }

    return res.status(401).json({
      success: false,
      error: "Authentication failed. Please try again.",
    });
  }
};

// Role-based authorization middleware
exports.authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "Authentication required for this operation.",
      });
    }

    if (!req.user.role) {
      return res.status(403).json({
        success: false,
        error: "User role not defined. Please contact support.",
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `Access denied. ${req.user.role} role cannot perform this action.`,
        requiredRoles: allowedRoles,
        userRole: req.user.role
      });
    }

    next();
  };
};

// Special authorization for admin only
exports.adminOnly = (req, res, next) => {
  return exports.authorize('admin')(req, res, next);
};

// Authorization for verified users only
exports.verifiedOnly = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "Authentication required.",
      });
    }

    const user = await User.findById(req.user.id).select('isVerified');
    
    if (!user || !user.isVerified) {
      return res.status(403).json({
        success: false,
        error: "Account verification required. Please verify your email address.",
      });
    }

    next();
  } catch (error) {
    console.error("VerifiedOnly middleware error:", error);
    return res.status(500).json({
      success: false,
      error: "Verification check failed.",
    });
  }
};

// Optional authentication (for public routes that can have enhanced features for logged-in users)
exports.optionalAuth = async (req, res, next) => {
  try {
    let token = getTokenFromRequest(req);

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId)
        .select('_id email role isActive isVerified');
      
      if (user && user.isActive) {
        req.userId = user._id;
        req.user = {
          id: user._id,
          email: user.email,
          role: user.role || 'user',
          isVerified: user.isVerified || false
        };
      }
    }
    
    next();
  } catch (error) {
    // Silently fail for optional auth
    next();
  }
};

// Ownership check middleware (check if user owns the resource)
exports.requireOwnership = (modelName, idParam = 'id') => {
  return async (req, res, next) => {
    try {
      const Model = require(`../models/${modelName}.model`);
      const resourceId = req.params[idParam];
      
      if (!resourceId) {
        return res.status(400).json({
          success: false,
          error: "Resource ID is required.",
        });
      }

      const resource = await Model.findById(resourceId);
      
      if (!resource) {
        return res.status(404).json({
          success: false,
          error: "Resource not found.",
        });
      }

      // Check ownership - adjust this based on your model structure
      let ownerField = 'user';
      let ownerId = resource[ownerField];
      
      // Handle different ownership field names
      if (!ownerId && resource.userId) {
        ownerId = resource.userId;
        ownerField = 'userId';
      }
      
      if (!ownerId && resource.createdBy) {
        ownerId = resource.createdBy;
        ownerField = 'createdBy';
      }

      if (!ownerId) {
        return res.status(500).json({
          success: false,
          error: "Resource ownership could not be determined.",
        });
      }

      // Convert to string for comparison
      const ownerIdStr = ownerId.toString();
      const userIdStr = req.userId.toString();

      if (ownerIdStr !== userIdStr && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          error: "You don't have permission to modify this resource.",
        });
      }

      // Attach resource to request for later use
      req.resource = resource;
      next();
    } catch (error) {
      console.error("Ownership check error:", error);
      return res.status(500).json({
        success: false,
        error: "Failed to verify resource ownership.",
      });
    }
  };
};

// Rate limiting helper (you can integrate with express-rate-limit)
exports.rateLimit = (options = {}) => {
  return (req, res, next) => {
    const userIdentifier = req.userId || req.ip;
    const limit = options.limit || 100; // requests
    const windowMs = options.windowMs || 15 * 60 * 1000; 
    
    next();
  };
};

// Check if user has completed profile
exports.profileCompleted = async (req, res, next) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        error: "Authentication required.",
      });
    }

    const Profile = require('../models/Profile.model');
    const profile = await Profile.findOne({ user: req.userId });
    
    if (!profile) {
      return res.status(403).json({
        success: false,
        error: "Please complete your profile to access this feature.",
        redirectTo: '/profile/create'
      });
    }

    if (profile.profileCompletion < 70) {
      return res.status(403).json({
        success: false,
        error: "Please complete your profile (at least 70%) to access this feature.",
        profileCompletion: profile.profileCompletion,
        redirectTo: '/profile/me'
      });
    }

    req.profile = profile;
    next();
  } catch (error) {
    console.error("Profile check error:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to check profile status.",
    });
  }
};

// Helper function to extract token from request
function getTokenFromRequest(req) {
  let token;

  // 1. Check Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }
  
  // 2. Check cookies
  else if (req.cookies?.token) {
    token = req.cookies.token;
  }
  
  // 3. Check query parameter (for email verification links, etc.)
  else if (req.query?.token) {
    token = req.query.token;
  }
  
  // 4. Check x-access-token header
  else if (req.headers['x-access-token']) {
    token = req.headers['x-access-token'];
  }

  return token;
}

// Export the helper for testing
exports._getTokenFromRequest = getTokenFromRequest;