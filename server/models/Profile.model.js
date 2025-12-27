const mongoose = require('mongoose');
const Option = require('./Option.model'); 

const profileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    sparse: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [30, 'Username cannot exceed 30 characters'],
    validate: {
      validator: function(v) {
        return /^[a-zA-Z0-9_]+$/.test(v);
      },
      message: 'Username can only contain letters, numbers, and underscores'
    }
  },
  
  profilePicture: {
    url: String,
    verified: { type: Boolean, default: false },
    uploadedAt: Date
  },
  
  bio: {
    type: String,
    maxlength: [2000, 'Bio cannot exceed 2000 characters'],
    trim: true,
    default: ''
  },
  
  photos: [{
    url: String,
    order: Number,
    isVerified: { type: Boolean, default: false },
    caption: String,
    uploadedAt: { type: Date, default: Date.now }
  }],
  
  dateOfBirth: {
    type: Date,
    validate: {
      validator: function(value) {
        const today = new Date();
        const minAgeDate = new Date();
        minAgeDate.setFullYear(today.getFullYear() - 18);
        return value <= minAgeDate;
      },
      message: 'You must be at least 18 years old'
    }
  },
  
  gender: {
    type: String,
    // Keep enum for backward compatibility, but will use dynamic validation
    enum: ['male', 'female', 'non-binary', 'other']
  },
  
  countryOfOrigin: String,
  
  currentLocation: {
    city: String,
    country: String,
    coordinates: {
      type: [Number],
      default: [0, 0]
    }
  },
  
  homeLanguage: String,
  
  religion: {
    type: String,
    // Keep enum for backward compatibility
    enum: [
      'christianity', 'islam', 'hinduism', 'buddhism', 'judaism',
      'atheist', 'agnostic', 'spiritual', 'other', 'prefer-not-to-say'
    ]
  },
  
  servingAs: {
    type: String,
    // Keep enum for backward compatibility
    enum: ['elder', 'minister', 'deacon', 'member', 'visitor', 'not-specified']
  },
  
  relationshipStatus: {
    type: String,
    enum: ['single', 'divorced', 'widowed', 'separated'],
    default: 'single'
  },
  
  lookingFor: {
    type: String,
    enum: ['marriage', 'serious-relationship', 'dating', 'friendship', 'not-sure'],
    default: 'not-sure'
  },
  
  haveChildren: {
    type: String,
    enum: ['no', 'yes-living-with-me', 'yes-not-living-with-me', 'prefer-not-to-say'],
    default: 'no'
  },
  
  wantsChildren: {
    type: Boolean,
    default: null
  },
  
  education: {
    type: String,
    enum: [
      'high-school', 'some-college', 'associate-degree',
      'bachelors-degree', 'masters-degree', 'phd', 'other'
    ]
  },
  
  occupation: String,
  
  income: {
    type: String,
    enum: [
      'under-25k', '25k-50k', '50k-75k', '75k-100k',
      '100k-150k', '150k-200k', '200k-plus', 'prefer-not-to-say'
    ]
  },
  
  height: {
    type: Number,
    min: [100, 'Height must be at least 100cm'],
    max: [250, 'Height cannot exceed 250cm']
  },
  
  matchPreferences: {
    gender: {
      type: String,
      enum: ['male', 'female', 'both'],
      default: 'both'
    },
    ageRange: {
      min: {
        type: Number,
        min: 18,
        max: 100,
        default: 21
      },
      max: {
        type: Number,
        min: 18,
        max: 100,
        default: 50,
        validate: {
          validator: function(value) {
            return value >= this.matchPreferences.ageRange.min;
          },
          message: 'Maximum age must be greater than or equal to minimum age'
        }
      }
    },
    locationRange: {
      type: Number,
      min: 1,
      max: 10000,
      default: 100
    },
    religion: {
      type: String,
      enum: ['same', 'similar', 'any', 'christian-only', 'muslim-only', 'not-important']
    },
    educationLevel: {
      type: String,
      enum: ['any', 'same-or-higher', 'bachelors-plus', 'not-important']
    },
    wantsChildren: {
      type: String,
      enum: ['yes', 'no', 'either', 'not-specified']
    }
  },
  
  profileViews: {
    type: Number,
    default: 0
  },
  
  likeCount: {
    type: Number,
    default: 0
  },
  
  matchCount: {
    type: Number,
    default: 0
  },
  
  isVerified: {
    type: Boolean,
    default: false
  },
  
  verificationBadges: [{
    type: String,
    enum: ['email', 'phone', 'photo', 'income', 'education']
  }],
  
  profileCompletion: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  
  lastActive: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: function(doc, ret) {
      ret.age = doc.age;
      delete ret._id;
      delete ret.__v;
      delete ret.dateOfBirth;
      return ret;
    }
  }
});

// Virtual for age
profileSchema.virtual('age').get(function() {
  if (!this.dateOfBirth) return null;
  
  const today = new Date();
  const birthDate = new Date(this.dateOfBirth);
  
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
});

// ============== NEW METHODS FOR DYNAMIC OPTIONS ==============

// Map profile fields to option categories
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

// Helper method to get option category for a field
profileSchema.methods.getOptionCategory = function(fieldPath) {
  return fieldCategoryMap[fieldPath] || fieldPath;
};

// Method to get display label for a field
profileSchema.methods.getFieldLabel = async function(fieldPath) {
  try {
    const category = this.getOptionCategory(fieldPath);
    let value;
    
    // Handle nested fields like matchPreferences.gender
    if (fieldPath.includes('.')) {
      const parts = fieldPath.split('.');
      value = this[parts[0]] ? this[parts[0]][parts[1]] : null;
    } else {
      value = this[fieldPath];
    }
    
    if (!value) return null;
    
    const option = await Option.findOne({ 
      category, 
      value,
      isActive: true 
    });
    
    return option ? option.label : value;
  } catch (error) {
    console.error(`Error getting label for ${fieldPath}:`, error);
    return null;
  }
};

// Method to get all labels for enum fields
profileSchema.methods.getAllLabels = async function() {
  const labels = {};
  
  const fieldsToLabel = [
    'gender',
    'religion',
    'servingAs',
    'relationshipStatus',
    'lookingFor',
    'haveChildren',
    'education',
    'income'
  ];
  
  for (const field of fieldsToLabel) {
    if (this[field]) {
      labels[`${field}Label`] = await this.getFieldLabel(field);
    }
  }
  
  // Handle match preferences
  if (this.matchPreferences) {
    labels.matchPreferences = {};
    
    if (this.matchPreferences.gender) {
      labels.matchPreferences.genderLabel = await this.getFieldLabel('matchPreferences.gender');
    }
    
    if (this.matchPreferences.religion) {
      labels.matchPreferences.religionLabel = await this.getFieldLabel('matchPreferences.religion');
    }
    
    if (this.matchPreferences.educationLevel) {
      labels.matchPreferences.educationLevelLabel = await this.getFieldLabel('matchPreferences.educationLevel');
    }
    
    if (this.matchPreferences.wantsChildren) {
      labels.matchPreferences.wantsChildrenLabel = await this.getFieldLabel('matchPreferences.wantsChildren');
    }
  }
  
  return labels;
};

// ============== FIXED PRE-SAVE HOOK ==============
// SIMPLE WORKING VERSION - Comment out problematic validation
profileSchema.pre('save', async function() {
  // Calculate profile completion percentage
  if (this.isModified()) {
    try {
      // Use a simpler calculation for now
      this.profileCompletion = await this.simpleCalculateCompletion();
    } catch (error) {
      // If calculation fails, set a default value
      this.profileCompletion = 0;
      console.error('Error calculating profile completion:', error.message);
    }
  }
});

// Simple completion calculation method (non-breaking)
profileSchema.methods.simpleCalculateCompletion = async function() {
  // Count completed fields
  const fields = [
    'username',
    'profilePicture',
    'bio',
    'dateOfBirth',
    'gender',
    'countryOfOrigin',
    'currentLocation',
    'homeLanguage',
    'religion',
    'servingAs',
    'relationshipStatus',
    'lookingFor',
    'haveChildren',
    'education',
    'occupation',
    'income',
    'height'
  ];
  
  let completed = 0;
  for (const field of fields) {
    if (field === 'profilePicture') {
      if (this.profilePicture && this.profilePicture.url) completed++;
    } else if (field === 'currentLocation') {
      if (this.currentLocation && (this.currentLocation.city || this.currentLocation.country)) completed++;
    } else if (this[field]) {
      completed++;
    }
  }
  
  // Calculate percentage (max 85% for basic fields, 15% for photos and preferences)
  const basicPercentage = Math.round((completed / fields.length) * 85);
  
  let extraPercentage = 0;
  if (this.photos && this.photos.length > 0) extraPercentage += 10;
  if (this.matchPreferences && (this.matchPreferences.gender || this.matchPreferences.ageRange)) extraPercentage += 5;
  
  return Math.min(100, basicPercentage + extraPercentage);
};

// Keep the old method for backward compatibility but fix it
profileSchema.methods.calculateCompletion = async function() {
  try {
    return await this.simpleCalculateCompletion();
  } catch (error) {
    console.error('Error in calculateCompletion:', error);
    return 0;
  }
};

// Method to get verification badges with labels (FIXED - not a virtual)
profileSchema.methods.getVerificationBadgesWithLabels = async function() {
  if (!this.verificationBadges || this.verificationBadges.length === 0) {
    return [];
  }
  
  try {
    const badgeOptions = await Option.find({ 
      category: 'verificationBadge',
      value: { $in: this.verificationBadges },
      isActive: true 
    });
    
    const badgeMap = new Map(badgeOptions.map(badge => [badge.value, badge]));
    
    return this.verificationBadges.map(badgeValue => {
      const option = badgeMap.get(badgeValue);
      return {
        value: badgeValue,
        label: option ? option.label : badgeValue,
        description: option ? option.description : ''
      };
    });
  } catch (error) {
    console.error('Error getting verification badges:', error);
    return this.verificationBadges.map(badgeValue => ({
      value: badgeValue,
      label: badgeValue
    }));
  }
};

// Instance method to add verification badge
profileSchema.methods.addVerificationBadge = async function(badgeValue) {
  if (!this.verificationBadges.includes(badgeValue)) {
    try {
      // Validate badge exists
      const option = await Option.findOne({ 
        category: 'verificationBadge', 
        value: badgeValue,
        isActive: true 
      });
      
      if (option) {
        this.verificationBadges.push(badgeValue);
        
        // Update verification status if needed
        if (this.verificationBadges.length >= 3) {
          this.isVerified = true;
        }
        
        return true;
      }
    } catch (error) {
      console.error('Error adding verification badge:', error);
    }
  }
  return false;
};

// Static method to get default values for fields
profileSchema.statics.getDefaultValues = async function() {
  const defaults = {
    relationshipStatus: 'single',
    lookingFor: 'not-sure',
    haveChildren: 'no',
    matchPreferences: {
      gender: 'both',
      ageRange: { min: 21, max: 50 },
      locationRange: 100
    }
  };
  
  try {
    const Option = mongoose.model('Option');
    const defaultOptions = await Option.find({ isDefault: true, isActive: true });
    
    for (const option of defaultOptions) {
      // Map category back to field
      const fieldMap = Object.fromEntries(
        Object.entries(fieldCategoryMap).map(([key, value]) => [value, key])
      );
      
      const field = fieldMap[option.category];
      if (field) {
        if (field.includes('.')) {
          const [parent, child] = field.split('.');
          if (!defaults[parent]) defaults[parent] = {};
          defaults[parent][child] = option.value;
        } else {
          defaults[field] = option.value;
        }
      }
    }
  } catch (error) {
    console.error('Error getting default values:', error);
  }
  
  return defaults;
};

// Export the model
module.exports = mongoose.model('Profile', profileSchema);