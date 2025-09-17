const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Login (admin or user)
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Admin shortcut
  if (
    username === (process.env.ADMIN_EMAIL || 'admin@gmail.com') &&
    password === (process.env.ADMIN_PASSWORD || '12345678')
  ) {
    let user = await User.findOne({ username });
    if (!user) {
      const hashed = await bcrypt.hash(password, 10);
      user = await User.create({ username, password: hashed, role: 'admin' });
    }
    const token = jwt.sign({ id: user._id, role: 'admin' }, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: '1d' });
    return res.json({
      token,
      role: 'admin',
      user: { _id: user._id, username: user.username, role: user.role, createdAt: user.createdAt, updatedAt: user.updatedAt }
    });
  }

  // Regular user login
  const user = await User.findOne({ username });
  if (!user || user.role !== 'user') return res.status(400).json({ message: 'User not found or not a user' });
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(400).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ id: user._id, role: 'user' }, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: '1d' });
  res.json({
    token,
    role: 'user',
    user: { _id: user._id, username: user.username, role: user.role, createdAt: user.createdAt, updatedAt: user.updatedAt }
  });
});

module.exports = router;