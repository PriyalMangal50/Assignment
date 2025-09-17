const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const router = express.Router();

// User signup
router.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  try {
    const existing = await User.findOne({ username });
    if (existing) return res.status(400).json({ message: 'User already exists.' });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword, role: 'user' });
    await user.save();
    res.status(201).json({
      message: 'User registered.',
      user: { _id: user._id, username: user.username, role: user.role },
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
