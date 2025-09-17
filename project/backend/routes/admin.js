const express = require('express');
const User = require('../models/User');
const verifyAdmin = require('../middleware/verifyAdmin'); // Import the middleware

const router = express.Router();

// List all users except admin
router.get('/users', verifyAdmin, async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: 'admin' } }).select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users', error: err.message });
  }
});

// Delete user
router.delete('/users/:id', verifyAdmin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete user', error: err.message });
  }
});

// Update user role
router.put('/users/:id', verifyAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { role: req.body.role }, { new: true }).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update user role', error: err.message });
  }
});

module.exports = router;