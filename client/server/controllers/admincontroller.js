// controllers/admin.controller.js
const Option = require('../models/Option.model');
const optionService = require('../services/option.service');

// Get all options with pagination
exports.getOptions = async (req, res) => {
  try {
    const { category, page = 1, limit = 50, search } = req.query;
    
    const query = { isActive: true };
    
    if (category) {
      query.category = category;
    }
    
    if (search) {
      query.$or = [
        { value: { $regex: search, $options: 'i' } },
        { label: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    const options = await Option.find(query)
      .sort({ category: 1, order: 1, label: 1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate('createdBy', 'firstName lastName email')
      .populate('updatedBy', 'firstName lastName email');
    
    const total = await Option.countDocuments(query);
    
    res.json({
      success: true,
      data: options,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get options error:', error);
    res.status(500).json({
      success: false,
      error: 'Unable to retrieve options'
    });
  }
};

// Get option by ID
exports.getOptionById = async (req, res) => {
  try {
    const option = await Option.findById(req.params.id)
      .populate('createdBy', 'firstName lastName email')
      .populate('updatedBy', 'firstName lastName email');
    
    if (!option) {
      return res.status(404).json({
        success: false,
        error: 'Option not found'
      });
    }
    
    res.json({
      success: true,
      data: option
    });
  } catch (error) {
    console.error('Get option by ID error:', error);
    res.status(500).json({
      success: false,
      error: 'Unable to retrieve option'
    });
  }
};

// Create new option
exports.createOption = async (req, res) => {
  try {
    // Add user info
    req.body.createdBy = req.userId;
    req.body.updatedBy = req.userId;
    
    const option = await Option.create(req.body);
    
    // Clear cache
    optionService.clearCache();
    
    res.status(201).json({
      success: true,
      message: 'Option created successfully',
      data: option
    });
  } catch (error) {
    console.error('Create option error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'Option with this value already exists in this category'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Unable to create option'
    });
  }
};

// Update option
exports.updateOption = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Add updatedBy
    req.body.updatedBy = req.userId;
    req.body.updatedAt = new Date();
    
    const option = await Option.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    ).populate('updatedBy', 'firstName lastName email');
    
    if (!option) {
      return res.status(404).json({
        success: false,
        error: 'Option not found'
      });
    }
    
    // Clear cache
    optionService.clearCache();
    
    res.json({
      success: true,
      message: 'Option updated successfully',
      data: option
    });
  } catch (error) {
    console.error('Update option error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'Option with this value already exists in this category'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Unable to update option'
    });
  }
};

// Delete option (soft delete)
exports.deleteOption = async (req, res) => {
  try {
    const { id } = req.params;
    
    const option = await Option.findByIdAndUpdate(
      id,
      { 
        isActive: false,
        updatedBy: req.userId,
        updatedAt: new Date()
      },
      { new: true }
    );
    
    if (!option) {
      return res.status(404).json({
        success: false,
        error: 'Option not found'
      });
    }
    
    // Clear cache
    optionService.clearCache();
    
    res.json({
      success: true,
      message: 'Option deleted successfully'
    });
  } catch (error) {
    console.error('Delete option error:', error);
    res.status(500).json({
      success: false,
      error: 'Unable to delete option'
    });
  }
};

// Get option categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Option.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);
    
    const categoryInfo = {
      gender: 'Gender identity options',
      religion: 'Religious affiliation',
      servingAs: 'Church service role',
      relationshipStatus: 'Current relationship status',
      lookingFor: 'What user is looking for',
      haveChildren: 'Parental status',
      education: 'Educational background',
      income: 'Income range',
      matchGender: 'Gender preference for matches',
      matchReligion: 'Religion preference for matches',
      matchEducationLevel: 'Education preference for matches',
      matchWantsChildren: 'Children preference for matches',
      verificationBadge: 'Types of verification badges'
    };
    
    const result = categories.map(cat => ({
      name: cat._id,
      count: cat.count,
      description: categoryInfo[cat._id] || 'No description available'
    }));
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      error: 'Unable to retrieve categories'
    });
  }
};