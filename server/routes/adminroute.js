// routes/admin.routes.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admincontroller');
const { protect, authorize } = require('../middleware/authmiddleware');

// All routes require admin authorization
router.use(protect);
router.use(authorize('admin'));

// Option management
router.get('/options', adminController.getOptions);
router.get('/options/categories', adminController.getCategories);
router.get('/options/:id', adminController.getOptionById);
router.post('/options', adminController.createOption);
router.put('/options/:id', adminController.updateOption);
router.delete('/options/:id', adminController.deleteOption);

module.exports = router;