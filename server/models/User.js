const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: function(v) {
        return validator.isEmail(v);
      },
      message: 'Please provide a valid email address'
    }
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false 
  },
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [30, 'Username cannot exceed 30 characters']
  },
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true
  },
  dob: {
    type: Date,
    required: [true, 'Date of birth is required'],
    validate: {
      validator: function(value) {
        // User must be at least 18 years old
        const minAgeDate = new Date();
        minAgeDate.setFullYear(minAgeDate.getFullYear() - 18);
        return value <= minAgeDate;
      },
      message: 'You must be at least 18 years old'
    }
  },
  gender: {
    type: String,
    required: [true, 'Gender is required'],
    enum: {
      values: ['male', 'female', 'other'],
      message: 'Gender must be male, female, or other'
    }
  },
  country: {
    type: String,
    required: [true, 'Country is required'],
    trim: true
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: Date
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: function(doc, ret) {
      delete ret._id;
      delete ret.password;
      return ret;
    }
  },
  toObject: {
    virtuals: true,
    transform: function(doc, ret) {
      delete ret._id;
      delete ret.password;
      return ret;
    }
  }
});

// Password hashing middleware
userSchema.pre('save', async function() {
  if (!this.isModified('password')) {
    return;
  }
  
  if (!this.password || typeof this.password !== 'string') {
    throw new Error('Password is required and must be a string');
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error) {
    console.error('Password hashing error:', error);
    throw new Error('Failed to hash password');
  }
});

// Method to check password
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};

// Virtual for age (18+ verification)
userSchema.virtual('age').get(function() {
  if (!this.dob) return null;
  
  const today = new Date();
  const birthDate = new Date(this.dob);
  
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
});

// Virtual to check if user is adult (18+)
userSchema.virtual('isAdult').get(function() {
  const age = this.age;
  return age !== null && age >= 18;
});

module.exports = mongoose.model('User', userSchema); 