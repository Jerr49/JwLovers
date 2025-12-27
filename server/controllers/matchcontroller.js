const Profile = require("../models/Profile.model");
const User = require("../models/User.model");
const Match = require("../models/Match.model");

// Find potential matches
exports.findMatches = async (req, res) => {
  try {
    const { limit = 20, skip = 0 } = req.query;
    
    const userProfile = await Profile.findOne({ user: req.userId });
    if (!userProfile) {
      return res.status(404).json({
        success: false,
        error: "Profile not found"
      });
    }

    // Build query based on preferences
    const query = {
      user: { $ne: req.userId },
      gender: userProfile.matchPreferences.gender === 'both' 
        ? { $in: ['male', 'female'] } 
        : userProfile.matchPreferences.gender,
      age: {
        $gte: userProfile.matchPreferences.ageRange.min,
        $lte: userProfile.matchPreferences.ageRange.max
      }
    };

    const potentialMatches = await Profile.find(query)
      .populate('user', 'firstName lastName')
      .sort({ profileCompletion: -1, lastActive: -1 })
      .skip(parseInt(skip))
      .limit(parseInt(limit));

    // Format response
    const matches = potentialMatches.map(profile => ({
      profile: {
        userId: profile.user._id,
        username: profile.username,
        profilePicture: profile.profilePicture,
        age: profile.age,
        gender: profile.gender,
        bio: profile.bio,
        location: profile.currentLocation?.city,
        religion: profile.religion,
        occupation: profile.occupation
      },
      compatibility: userProfile.calculateCompatibility(profile)
    }));

    res.json({
      success: true,
      data: {
        matches,
        count: matches.length,
        total: await Profile.countDocuments(query)
      }
    });
  } catch (error) {
    console.error("Find matches error:", error);
    res.status(500).json({
      success: false,
      error: "Unable to find matches"
    });
  }
};

// Like a user
exports.likeUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Check if already liked or matched
    const profile = await Profile.findOne({ user: req.userId });
    if (profile.likes.includes(userId)) {
      return res.status(400).json({
        success: false,
        error: "Already liked this user"
      });
    }

    // Add to likes
    await Profile.findOneAndUpdate(
      { user: req.userId },
      { $addToSet: { likes: userId } }
    );

    // Check if it's a mutual like (creates a match)
    const otherProfile = await Profile.findOne({ user: userId });
    if (otherProfile.likes.includes(req.userId)) {
      // Create a match
      const match = await Match.create({
        user1: req.userId,
        user2: userId,
        compatibilityScore: profile.calculateCompatibility(otherProfile)
      });

      // Update both profiles
      await Profile.findOneAndUpdate(
        { user: req.userId },
        { 
          $addToSet: { matches: { user: userId, matchedAt: new Date() } },
          $inc: { matchCount: 1 }
        }
      );

      await Profile.findOneAndUpdate(
        { user: userId },
        { 
          $addToSet: { matches: { user: req.userId, matchedAt: new Date() } },
          $inc: { matchCount: 1 }
        }
      );

      return res.json({
        success: true,
        message: "It's a match!",
        data: { match: true, matchId: match._id }
      });
    }

    res.json({
      success: true,
      message: "Like sent successfully",
      data: { match: false }
    });
  } catch (error) {
    console.error("Like user error:", error);
    res.status(500).json({
      success: false,
      error: "Unable to like user"
    });
  }
};