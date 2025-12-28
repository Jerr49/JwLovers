// services/option.service.js
const Option = require('../models/Option.model');

class OptionService {
  constructor() {
    this.cache = new Map();
    this.lastUpdate = null;
    this.cacheDuration = 5 * 60 * 1000; // 5 minutes
  }

  async getAllOptions() {
    const now = Date.now();
    
    // Return cached data if still valid
    if (this.lastUpdate && (now - this.lastUpdate < this.cacheDuration)) {
      return this.cache;
    }
    
    // Fetch from database
    const options = await Option.find({ isActive: true }).sort({ category: 1, order: 1 });
    
    // Group by category
    const groupedOptions = {};
    options.forEach(option => {
      if (!groupedOptions[option.category]) {
        groupedOptions[option.category] = [];
      }
      groupedOptions[option.category].push({
        value: option.value,
        label: option.label,
        description: option.description,
        isDefault: option.isDefault
      });
    });
    
    // Update cache
    this.cache = groupedOptions;
    this.lastUpdate = now;
    
    return groupedOptions;
  }

  async getOptionsByCategory(category) {
    const allOptions = await this.getAllOptions();
    return allOptions[category] || [];
  }

  async getOptionLabel(category, value) {
    const options = await this.getOptionsByCategory(category);
    const option = options.find(opt => opt.value === value);
    return option ? option.label : value;
  }

  async getDefaultValue(category) {
    const options = await this.getOptionsByCategory(category);
    const defaultOption = options.find(opt => opt.isDefault);
    return defaultOption ? defaultOption.value : null;
  }

  async validateOption(category, value) {
    const options = await this.getOptionsByCategory(category);
    return options.some(opt => opt.value === value);
  }

  // Clear cache (call this when admin updates options)
  clearCache() {
    this.cache.clear();
    this.lastUpdate = null;
  }
}

module.exports = new OptionService();