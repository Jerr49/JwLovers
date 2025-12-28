const User = require('../models/User.model');
const Profile = require('../models/Profile.model');
const Match = require('../models/Match.model');

class ProfileService {
  
  // Get complete user info (private + public)
  async getCompleteUser(userId) {
    const [user, profile] = await Promise.all([
      User.findById(userId),
      Profile.findOne({ user: userId }).populate('user', 'firstName lastName')
    ]);
    
    if (!user || !profile) {
      throw new Error('User or profile not found');
    }
    
    return {
      privateInfo: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        isEmailVerified: user.isEmailVerified,
        isPhoneVerified: user.isPhoneVerified
      },
      publicProfile: {
        username: profile.username,
        profilePicture: profile.profilePicture,
        bio: profile.bio,
        photos: profile.photos,
        // About Him
        age: profile.age,
        gender: profile.gender,
        height: profile.height,
        countryOfOrigin: profile.countryOfOrigin,
        currentLocation: profile.currentLocation,
        homeLanguage: profile.homeLanguage,
        religion: profile.religion,
        servingAs: profile.servingAs,
        relationshipStatus: profile.relationshipStatus,
        lookingFor: profile.lookingFor,
        haveChildren: profile.haveChildren,
        wantsChildren: profile.wantsChildren,
        education: profile.education,
        occupation: profile.occupation,
        income: profile.income,
        // Match preferences
        matchPreferences: profile.matchPreferences,
        // Stats
        profileCompletion: profile.profileCompletion,
        isVerified: profile.isVerified
      }
    };
  }
  
  // Update private info
  async updatePrivateInfo(userId, updateData) {
    const allowedFields = ['firstName', 'lastName', 'phoneNumber', 'notificationSettings'];
    const filteredData = {};
    
    allowedFields.forEach(field => {
      if (updateData[field] !== undefined) {
        filteredData[field] = updateData[field];
      }
    });
    
    // Handle password change separately if needed
    if (updateData.password) {
      filteredData.password = updateData.password;
    }
    
    return await User.findByIdAndUpdate(
      userId,
      filteredData,
      { new: true, runValidators: true }
    );
  }
  
  // Update public profile
  async updatePublicProfile(userId, updateData) {
    return await Profile.findOneAndUpdate(
      { user: userId },
      updateData,
      { new: true, runValidators: true }
    );
  }
  
  // Find potential matches
  async findPotentialMatches(userId, options = {}) {
    const userProfile = await Profile.findOne({ user: userId });
    if (!userProfile) throw new Error('Profile not found');
    
    const { limit = 20, skip = 0 } = options;
    
    // Build match query based on user's preferences
    const query = {
      user: { $ne: userId },
      gender: userProfile.matchPreferences.gender === 'both' 
        ? { $in: ['male', 'female'] } 
        : userProfile.matchPreferences.gender,
      age: {
        $gte: userProfile.matchPreferences.ageRange.min,
        $lte: userProfile.matchPreferences.ageRange.max
      }
    };
    
    // Additional filters based on preferences
    if (userProfile.matchPreferences.religion === 'same') {
      query.religion = userProfile.religion;
    }
    
    if (userProfile.matchPreferences.wantsChildren === 'yes') {
      query.wantsChildren = true;
    } else if (userProfile.matchPreferences.wantsChildren === 'no') {
      query.wantsChildren = false;
    }
    
    // Find profiles
    const potentialMatches = await Profile.find(query)
      .populate('user', 'firstName lastName')
      .sort({ profileCompletion: -1, lastActive: -1 })
      .skip(skip)
      .limit(limit);
    
    // Calculate compatibility for each
    const matchesWithCompatibility = await Promise.all(
      potentialMatches.map(async (profile) => {
        const compatibility = userProfile.calculateCompatibility(profile);
        const matchesPreferences = userProfile.matchesPreferences(profile);
        
        return {
          profile: {
            username: profile.username,
            profilePicture: profile.profilePicture,
            bio: profile.bio,
            age: profile.age,
            gender: profile.gender,
            height: profile.height,
            countryOfOrigin: profile.countryOfOrigin,
            currentLocation: profile.currentLocation,
            homeLanguage: profile.homeLanguage,
            religion: profile.religion,
            servingAs: profile.servingAs,
            relationshipStatus: profile.relationshipStatus,
            lookingFor: profile.lookingFor,
            haveChildren: profile.haveChildren,
            wantsChildren: profile.wantsChildren,
            education: profile.education,
            occupation: profile.occupation,
            income: profile.income
          },
          compatibilityScore: compatibility,
          matchesPreferences: matchesPreferences,
          distance: userProfile.currentLocation.coordinates[0] !== 0 && 
                   profile.currentLocation.coordinates[0] !== 0
            ? 'Within range' // You'd calculate actual distance
            : 'Unknown'
        };
      })
    );
    
    // Sort by compatibility score
    return matchesWithCompatibility.sort((a, b) => b.compatibilityScore - a.compatibilityScore);
  }
  
  // Get existing matches
  async getExistingMatches(userId) {
    const matches = await Match.find({
      $or: [{ user1: userId }, { user2: userId }],
      status: 'active'
    })
    .populate('user1', 'firstName lastName')
    .populate('user2', 'firstName lastName')
    .sort({ lastMessageAt: -1, matchedAt: -1 });
    
    // Get full profiles for matches
    const matchDetails = await Promise.all(
      matches.map(async (match) => {
        const otherUserId = match.getOtherUser(userId).toString();
        const otherProfile = await Profile.findOne({ user: otherUserId });
        
        return {
          matchId: match._id,
          matchedAt: match.matchedAt,
          compatibilityScore: match.compatibilityScore,
          lastMessageAt: match.lastMessageAt,
          profile: otherProfile ? {
            username: otherProfile.username,
            profilePicture: otherProfile.profilePicture,
            age: otherProfile.age,
            gender: otherProfile.gender,
            bio: otherProfile.bio,
            // All other profile fields...
          } : null
        };
      })
    );
    
    return matchDetails;
  }
}

module.exports = new ProfileService();