const Profile = require("../models/Profile.model");
const User = require("../models/User.model");
const Option = require("../models/Option.model"); 
const optionService = require("../services/option.service"); 

// Get user's complete profile (public + private)
exports.getCompleteProfile = async (req, res) => {
  try {
    const [user, profile] = await Promise.all([
      User.findById(req.userId).select('firstName lastName email phoneNumber'),
      Profile.findOne({ user: req.userId })
    ]);

    if (!user || !profile) {
      return res.status(404).json({
        success: false,
        error: "User or profile not found"
      });
    }

    // Get dynamic option labels for the profile
    const profileWithLabels = profile.toObject();
    
    // Get labels for all enum fields
    const labels = await profile.getAllLabels();
    
    // Merge labels into profile data
    Object.assign(profileWithLabels, labels);

    // Get verification badges with labels
    profileWithLabels.verificationBadgesWithLabels = await profile.verificationBadgesWithLabels;

    res.json({
      success: true,
      data: {
        // Private info (only for owner)
        privateInfo: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phoneNumber: user.phoneNumber
        },
        // Public profile with labels
        publicProfile: profileWithLabels
      }
    });
  } catch (error) {
    console.error("Get complete profile error:", error);
    res.status(500).json({
      success: false,
      error: "Unable to retrieve profile"
    });
  }
};

// Get public profile (for other users)
exports.getPublicProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    const profile = await Profile.findOne({ user: userId })
      .populate('user', 'firstName lastName');
    
    if (!profile) {
      return res.status(404).json({
        success: false,
        error: "Profile not found"
      });
    }

    // Increment profile views
    profile.profileViews += 1;
    await profile.save();

    // Get labels for display
    const labels = await profile.getAllLabels();
    const verificationBadgesWithLabels = await profile.verificationBadgesWithLabels;

    res.json({
      success: true,
      data: {
        profile: {
          username: profile.username,
          profilePicture: profile.profilePicture,
          bio: profile.bio,
          photos: profile.photos,
          age: profile.age,
          gender: profile.gender,
          genderLabel: labels.genderLabel,
          height: profile.height,
          countryOfOrigin: profile.countryOfOrigin,
          currentLocation: {
            city: profile.currentLocation?.city,
            country: profile.currentLocation?.country
          },
          homeLanguage: profile.homeLanguage,
          religion: profile.religion,
          religionLabel: labels.religionLabel,
          servingAs: profile.servingAs,
          servingAsLabel: labels.servingAsLabel,
          relationshipStatus: profile.relationshipStatus,
          relationshipStatusLabel: labels.relationshipStatusLabel,
          lookingFor: profile.lookingFor,
          lookingForLabel: labels.lookingForLabel,
          haveChildren: profile.haveChildren,
          haveChildrenLabel: labels.haveChildrenLabel,
          wantsChildren: profile.wantsChildren,
          education: profile.education,
          educationLabel: labels.educationLabel,
          occupation: profile.occupation,
          income: profile.income,
          incomeLabel: labels.incomeLabel,
          profileCompletion: profile.profileCompletion,
          isVerified: profile.isVerified,
          verificationBadges: verificationBadgesWithLabels,
          firstName: profile.user?.firstName,
          lastName: profile.user?.lastName,
          lastActive: profile.lastActive,
          createdAt: profile.createdAt
        }
      }
    });
  } catch (error) {
    console.error("Get public profile error:", error);
    res.status(500).json({
      success: false,
      error: "Unable to retrieve profile"
    });
  }
};

// Get profile options (for frontend dropdowns)
exports.getProfileOptions = async (req, res) => {
  try {
    const options = await optionService.getAllOptions();
    
    res.json({
      success: true,
      data: options
    });
  } catch (error) {
    console.error('Get profile options error:', error);
    res.status(500).json({
      success: false,
      error: 'Unable to retrieve profile options'
    });
  }
};

// Get default profile values
exports.getDefaultProfileValues = async (req, res) => {
  try {
    const defaults = await Profile.getDefaultValues();
    
    res.json({
      success: true,
      data: defaults
    });
  } catch (error) {
    console.error('Get default values error:', error);
    res.status(500).json({
      success: false,
      error: 'Unable to retrieve default values'
    });
  }
};

// Update profile
exports.updateProfile = async (req, res) => {
  try {
    const allowedFields = [
      'username', 'bio', 'photos', 'gender', 'dateOfBirth', 'height',
      'countryOfOrigin', 'currentLocation', 'homeLanguage', 'religion',
      'servingAs', 'relationshipStatus', 'lookingFor', 'haveChildren',
      'wantsChildren', 'education', 'occupation', 'income',
      'matchPreferences'
    ];

    const updateData = {};
    const validationErrors = [];
    
    // Define field-to-category mapping for validation
    const fieldCategoryMap = {
      'gender': 'gender',
      'religion': 'religion',
      'servingAs': 'servingAs',
      'relationshipStatus': 'relationshipStatus',
      'lookingFor': 'lookingFor',
      'haveChildren': 'haveChildren',
      'education': 'education',
      'income': 'income',
      'matchPreferences.gender': 'matchGender',
      'matchPreferences.religion': 'matchReligion',
      'matchPreferences.educationLevel': 'matchEducationLevel',
      'matchPreferences.wantsChildren': 'matchWantsChildren'
    };

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        if (field === 'username') {
          // Check username availability
          const existingProfile = await Profile.findOne({
            username: req.body[field].trim().toLowerCase(),
            user: { $ne: req.userId }
          });
          
          if (existingProfile) {
            return res.status(400).json({
              success: false,
              error: "Username already taken"
            });
          }
          updateData[field] = req.body[field].trim().toLowerCase();
        } 
        // Validate enum fields against dynamic options
        else if (fieldCategoryMap[field] && req.body[field]) {
          const isValid = await optionService.validateOption(
            fieldCategoryMap[field], 
            req.body[field]
          );
          
          if (!isValid) {
            validationErrors.push(`Invalid value for ${field}: "${req.body[field]}"`);
            continue;
          }
          updateData[field] = req.body[field];
        }
        // Handle matchPreferences separately
        else if (field === 'matchPreferences' && req.body.matchPreferences) {
          // Validate each preference field
          const prefValidations = {
            'gender': 'matchGender',
            'religion': 'matchReligion',
            'educationLevel': 'matchEducationLevel',
            'wantsChildren': 'matchWantsChildren'
          };
          
          const validPreferences = {};
          
          for (const [prefField, category] of Object.entries(prefValidations)) {
            if (req.body.matchPreferences[prefField]) {
              const isValid = await optionService.validateOption(
                category,
                req.body.matchPreferences[prefField]
              );
              
              if (!isValid) {
                validationErrors.push(`Invalid value for match preference "${prefField}": "${req.body.matchPreferences[prefField]}"`);
              } else {
                validPreferences[prefField] = req.body.matchPreferences[prefField];
              }
            }
          }
          
          // Add other non-enum preferences
          if (req.body.matchPreferences.ageRange) {
            // Validate age range
            const { min, max } = req.body.matchPreferences.ageRange;
            if (min && max && min > max) {
              validationErrors.push('Minimum age cannot be greater than maximum age');
            } else {
              validPreferences.ageRange = req.body.matchPreferences.ageRange;
            }
          }
          
          if (req.body.matchPreferences.locationRange) {
            const locationRange = parseInt(req.body.matchPreferences.locationRange);
            if (locationRange >= 1 && locationRange <= 10000) {
              validPreferences.locationRange = locationRange;
            } else {
              validationErrors.push('Location range must be between 1 and 10000 km');
            }
          }
          
          updateData.matchPreferences = validPreferences;
        }
        else {
          updateData[field] = req.body[field];
        }
      }
    }

    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        error: validationErrors.join(', ')
      });
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        error: "No valid data provided to update"
      });
    }

    // Calculate profile completion
    const existingProfile = await Profile.findOne({ user: req.userId });
    if (existingProfile) {
      // Merge existing data with updates for completion calculation
      const mergedProfile = { ...existingProfile.toObject(), ...updateData };
      const tempProfile = new Profile(mergedProfile);
      updateData.profileCompletion = await tempProfile.calculateCompletion();
    }

    const profile = await Profile.findOneAndUpdate(
      { user: req.userId },
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!profile) {
      return res.status(404).json({
        success: false,
        error: "Profile not found",
      });
    }

    // Get updated labels for response
    const labels = await profile.getAllLabels();

    res.json({
      success: true,
      message: "Profile updated successfully",
      data: {
        profile: {
          username: profile.username,
          bio: profile.bio,
          age: profile.age,
          gender: profile.gender,
          genderLabel: labels.genderLabel,
          profileCompletion: profile.profileCompletion,
          updatedAt: profile.updatedAt
        }
      }
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

    if (error.code === 11000 && error.keyPattern && error.keyPattern.username) {
      return res.status(400).json({
        success: false,
        error: "Username already exists",
      });
    }

    // Handle dynamic option validation errors
    if (error.message && error.message.includes('Invalid value')) {
      return res.status(400).json({
        success: false,
        error: error.message
      });
    }

    res.status(500).json({
      success: false,
      error: "Unable to update profile",
    });
  }
};

// Create or initialize profile
exports.createProfile = async (req, res) => {
  try {
    const { username } = req.body;

    // Check if profile already exists
    const existingProfile = await Profile.findOne({ user: req.userId });
    if (existingProfile) {
      return res.status(400).json({
        success: false,
        error: "Profile already exists for this user"
      });
    }

    // Check username availability
    const usernameTaken = await Profile.findOne({
      username: username.trim().toLowerCase()
    });
    
    if (usernameTaken) {
      return res.status(400).json({
        success: false,
        error: "Username already taken"
      });
    }

    // Get default values for new profile
    const defaultValues = await Profile.getDefaultValues();
    
    // Create profile with defaults and provided data
    const profileData = {
      user: req.userId,
      username: username.trim().toLowerCase(),
      ...defaultValues,
      ...req.body
    };

    const profile = await Profile.create(profileData);

    res.status(201).json({
      success: true,
      message: "Profile created successfully",
      data: {
        profile: {
          username: profile.username,
          profileCompletion: profile.profileCompletion,
          createdAt: profile.createdAt
        }
      }
    });
  } catch (error) {
    console.error("Create profile error:", error);

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        error: errors.join(", "),
      });
    }

    if (error.code === 11000 && error.keyPattern && error.keyPattern.username) {
      return res.status(400).json({
        success: false,
        error: "Username already exists",
      });
    }

    res.status(500).json({
      success: false,
      error: "Unable to create profile",
    });
  }
};

// Update profile picture
exports.updateProfilePicture = async (req, res) => {
  try {
    const { profilePicture } = req.body;

    if (!profilePicture || !profilePicture.url) {
      return res.status(400).json({
        success: false,
        error: "Profile picture URL is required"
      });
    }

    const updateData = {
      profilePicture: {
        url: profilePicture.url,
        verified: profilePicture.verified || false,
        uploadedAt: profilePicture.uploadedAt || new Date()
      }
    };

    const profile = await Profile.findOneAndUpdate(
      { user: req.userId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!profile) {
      return res.status(404).json({
        success: false,
        error: "Profile not found",
      });
    }

    // Update profile completion
    profile.profileCompletion = await profile.calculateCompletion();
    await profile.save();

    res.json({
      success: true,
      message: "Profile picture updated successfully",
      data: {
        profilePicture: profile.profilePicture,
        profileCompletion: profile.profileCompletion
      }
    });
  } catch (error) {
    console.error("Update profile picture error:", error);
    res.status(500).json({
      success: false,
      error: "Unable to update profile picture",
    });
  }
};

// Add/remove photos
exports.updatePhotos = async (req, res) => {
  try {
    const { photos } = req.body;

    if (!Array.isArray(photos)) {
      return res.status(400).json({
        success: false,
        error: "Photos must be an array"
      });
    }

    // Validate each photo
    const validatedPhotos = photos.map((photo, index) => ({
      url: photo.url || photo,
      order: photo.order || index,
      isVerified: photo.isVerified || false,
      caption: photo.caption || '',
      uploadedAt: photo.uploadedAt || new Date()
    }));

    const profile = await Profile.findOneAndUpdate(
      { user: req.userId },
      { photos: validatedPhotos },
      { new: true, runValidators: true }
    );

    // Update profile completion
    profile.profileCompletion = await profile.calculateCompletion();
    await profile.save();

    res.json({
      success: true,
      message: "Photos updated successfully",
      data: {
        photos: profile.photos,
        profileCompletion: profile.profileCompletion
      }
    });
  } catch (error) {
    console.error("Update photos error:", error);
    res.status(500).json({
      success: false,
      error: "Unable to update photos"
    });
  }
};

// Update match preferences
exports.updateMatchPreferences = async (req, res) => {
  try {
    const { gender, ageRange, locationRange, religion, educationLevel, wantsChildren } = req.body;

    const updateData = { matchPreferences: {} };
    const validationErrors = [];
    
    // Validate each field against dynamic options
    if (gender) {
      const isValid = await optionService.validateOption('matchGender', gender);
      if (!isValid) {
        validationErrors.push(`Invalid value for match gender: "${gender}"`);
      } else {
        updateData.matchPreferences.gender = gender;
      }
    }
    
    if (ageRange) {
      const { min, max } = ageRange;
      if (min && max && min > max) {
        validationErrors.push('Minimum age cannot be greater than maximum age');
      } else {
        updateData.matchPreferences.ageRange = ageRange;
      }
    }
    
    if (locationRange) {
      const range = parseInt(locationRange);
      if (range >= 1 && range <= 10000) {
        updateData.matchPreferences.locationRange = range;
      } else {
        validationErrors.push('Location range must be between 1 and 10000 km');
      }
    }
    
    if (religion) {
      const isValid = await optionService.validateOption('matchReligion', religion);
      if (!isValid) {
        validationErrors.push(`Invalid value for match religion: "${religion}"`);
      } else {
        updateData.matchPreferences.religion = religion;
      }
    }
    
    if (educationLevel) {
      const isValid = await optionService.validateOption('matchEducationLevel', educationLevel);
      if (!isValid) {
        validationErrors.push(`Invalid value for match education level: "${educationLevel}"`);
      } else {
        updateData.matchPreferences.educationLevel = educationLevel;
      }
    }
    
    if (wantsChildren) {
      const isValid = await optionService.validateOption('matchWantsChildren', wantsChildren);
      if (!isValid) {
        validationErrors.push(`Invalid value for match wants children: "${wantsChildren}"`);
      } else {
        updateData.matchPreferences.wantsChildren = wantsChildren;
      }
    }

    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        error: validationErrors.join(', ')
      });
    }

    const profile = await Profile.findOneAndUpdate(
      { user: req.userId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!profile) {
      return res.status(404).json({
        success: false,
        error: "Profile not found",
      });
    }

    // Get labels for the updated preferences
    const labels = {};
    if (profile.matchPreferences) {
      if (profile.matchPreferences.gender) {
        labels.genderLabel = await optionService.getOptionLabel('matchGender', profile.matchPreferences.gender);
      }
      if (profile.matchPreferences.religion) {
        labels.religionLabel = await optionService.getOptionLabel('matchReligion', profile.matchPreferences.religion);
      }
      // Add other labels as needed
    }

    res.json({
      success: true,
      message: "Match preferences updated successfully",
      data: {
        matchPreferences: {
          ...profile.matchPreferences.toObject(),
          ...labels
        }
      }
    });
  } catch (error) {
    console.error("Update match preferences error:", error);
    res.status(500).json({
      success: false,
      error: "Unable to update match preferences"
    });
  }
};

// Add verification badge
exports.addVerificationBadge = async (req, res) => {
  try {
    const { badge } = req.body;

    if (!badge) {
      return res.status(400).json({
        success: false,
        error: "Badge type is required"
      });
    }

    const profile = await Profile.findOne({ user: req.userId });
    
    if (!profile) {
      return res.status(404).json({
        success: false,
        error: "Profile not found"
      });
    }

    const success = await profile.addVerificationBadge(badge);
    
    if (!success) {
      return res.status(400).json({
        success: false,
        error: "Invalid badge type or badge already exists"
      });
    }

    await profile.save();
    
    // Get updated badges with labels
    const verificationBadgesWithLabels = await profile.verificationBadgesWithLabels;

    res.json({
      success: true,
      message: "Verification badge added successfully",
      data: {
        isVerified: profile.isVerified,
        verificationBadges: verificationBadgesWithLabels
      }
    });
  } catch (error) {
    console.error("Add verification badge error:", error);
    res.status(500).json({
      success: false,
      error: "Unable to add verification badge"
    });
  }
};

// Get profile stats
exports.getProfileStats = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.userId })
      .select('profileViews likeCount matchCount responseRate profileCompletion lastActive');

    if (!profile) {
      return res.status(404).json({
        success: false,
        error: "Profile not found"
      });
    }

    // Calculate response rate if needed
    let responseRate = profile.responseRate;
    if (!responseRate) {
      // You would implement your own logic here based on messages/response tracking
      responseRate = 0;
    }

    res.json({
      success: true,
      data: {
        stats: {
          profileViews: profile.profileViews,
          likeCount: profile.likeCount,
          matchCount: profile.matchCount,
          responseRate: responseRate,
          profileCompletion: profile.profileCompletion,
          lastActive: profile.lastActive,
          daysSinceLastActive: Math.floor((Date.now() - profile.lastActive) / (1000 * 60 * 60 * 24))
        }
      }
    });
  } catch (error) {
    console.error("Get profile stats error:", error);
    res.status(500).json({
      success: false,
      error: "Unable to get profile stats"
    });
  }
};

// Get profile completion breakdown
exports.getProfileCompletion = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.userId });
    
    if (!profile) {
      return res.status(404).json({
        success: false,
        error: "Profile not found"
      });
    }

    const completion = await profile.calculateCompletion();
    
    // Get which fields are missing
    const missingFields = [];
    const weightMap = {
      username: 'Username',
      profilePicture: 'Profile Picture',
      bio: 'Bio',
      photos: 'Photos',
      dateOfBirth: 'Date of Birth',
      gender: 'Gender',
      countryOfOrigin: 'Country of Origin',
      currentLocation: 'Current Location',
      homeLanguage: 'Home Language',
      religion: 'Religion',
      servingAs: 'Serving As',
      relationshipStatus: 'Relationship Status',
      lookingFor: 'Looking For',
      haveChildren: 'Have Children',
      wantsChildren: 'Wants Children',
      education: 'Education',
      occupation: 'Occupation',
      income: 'Income',
      height: 'Height',
      matchPreferences: 'Match Preferences'
    };

    for (const [field, label] of Object.entries(weightMap)) {
      let isCompleted = false;
      
      if (field === 'profilePicture') {
        isCompleted = !!(profile.profilePicture && profile.profilePicture.url);
      } else if (field === 'photos') {
        isCompleted = profile.photos && profile.photos.length > 0;
      } else if (field === 'currentLocation') {
        isCompleted = !!(profile.currentLocation && (profile.currentLocation.city || profile.currentLocation.country));
      } else if (field === 'matchPreferences') {
        isCompleted = !!(profile.matchPreferences && (
          profile.matchPreferences.gender || 
          profile.matchPreferences.ageRange ||
          profile.matchPreferences.religion
        ));
      } else {
        isCompleted = !!profile[field];
      }
      
      if (!isCompleted) {
        missingFields.push(label);
      }
    }

    res.json({
      success: true,
      data: {
        completionPercentage: completion,
        missingFields,
        nextSteps: missingFields.slice(0, 3) 
      }
    });
  } catch (error) {
    console.error("Get profile completion error:", error);
    res.status(500).json({
      success: false,
      error: "Unable to get profile completion details"
    });
  }
};