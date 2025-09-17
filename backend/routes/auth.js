const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();


// Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  // Admin login: fixed credentials, no signup required
  if (
    username === (process.env.ADMIN_EMAIL || 'admin@gmail.com') &&
    password === (process.env.ADMIN_PASSWORD || '12345678')
  ) {
    // Find or create admin user in DB
    let user = await User.findOne({ username });
    if (!user) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user = await User.create({ username, password: hashedPassword, role: 'admin' });
    }
    const token = jwt.sign({ id: user._id, role: 'admin' }, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: '1d' });
    return res.json({
      token,
      role: 'admin',
      user: {
        _id: user._id,
        username: user.username,
        role: user.role,
        createdAt: user.createdAt || new Date().toISOString(),
        updatedAt: user.updatedAt || new Date().toISOString(),
      }
    });
  }
  // User login: must exist in DB
  const user = await User.findOne({ username });
  if (!user || user.role !== 'user') return res.status(400).json({ message: 'User not found.' });
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: 'Invalid credentials.' });
  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: '1d' });
  res.json({
    token,
    role: user.role,
    user: {
      _id: user._id,
      username: user.username,
      role: user.role,
      createdAt: user.createdAt || new Date().toISOString(),
      updatedAt: user.updatedAt || new Date().toISOString(),
    }
  });
});

module.exports = router;
