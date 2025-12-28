const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  user1: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  user2: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  
  // Match details
  matchedAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  matchedBy: {
    type: String,
    enum: ['mutual-like', 'super-like', 'admin', 'algorithm'],
    default: 'mutual-like'
  },
  
  // Compatibility score
  compatibilityScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  
  // Match status
  status: {
    type: String,
    enum: ['pending', 'active', 'paused', 'ended', 'blocked'],
    default: 'active',
    index: true
  },
  
  // Interaction tracking
  lastMessageAt: Date,
  messageCount: {
    type: Number,
    default: 0
  },
  
  // Quality metrics
  responseRate1: Number,
  responseRate2: Number, 
  avgResponseTime: Number, 
  
  // Match preferences met
  preferencesMet: {
    age: Boolean,
    religion: Boolean,
    location: Boolean,
    education: Boolean,
    children: Boolean
  }
}, {
  timestamps: true
});

// Compound indexes
matchSchema.index({ user1: 1, user2: 1 }, { unique: true });
matchSchema.index({ user1: 1, status: 1, matchedAt: -1 });
matchSchema.index({ user2: 1, status: 1, matchedAt: -1 });
matchSchema.index({ compatibilityScore: -1 });

// Virtual for checking if match is mutual
matchSchema.virtual('isMutual').get(function() {
  return this.status === 'active';
});

// Method to get the other user in match
matchSchema.methods.getOtherUser = function(currentUserId) {
  return this.user1.toString() === currentUserId.toString() ? this.user2 : this.user1;
};

module.exports = mongoose.model('Match', matchSchema);