const express = require('express');
const Blog = require('../models/Blog');
const Comment = require('../models/Comment');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Middleware to verify JWT and admin role
function verifyAdmin(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ message: 'No token provided.' });
  try {
    const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET || 'your_jwt_secret');
    if (decoded.role !== 'admin') return res.status(403).json({ message: 'Admin only.' });
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token.' });
  }
}

// Create blog (admin only)
router.post('/', verifyAdmin, async (req, res) => {
  const { title, description, mediaUrl } = req.body;
  try {
    const blog = new Blog({
      title,
      description,
      mediaUrl,
      author: req.userId,
    });
    await blog.save();
    const populatedBlog = await Blog.findById(blog._id)
      .populate('author', 'username role createdAt updatedAt')
      .populate({ path: 'comments', populate: { path: 'author', select: 'username role createdAt updatedAt' } });
    res.status(201).json(populatedBlog);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Edit blog (admin only)
router.put('/:id', verifyAdmin, async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
    const populatedBlog = await Blog.findById(blog._id)
      .populate('author', 'username role createdAt updatedAt')
      .populate({ path: 'comments', populate: { path: 'author', select: 'username role createdAt updatedAt' } });
    res.json(populatedBlog);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete blog (admin only)
router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.json({ message: 'Blog deleted.' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all blogs (public) with pagination and search
router.get('/', async (req, res) => {
  const { page = 1, limit = 10, search = '' } = req.query;
  const query = search
    ? { $or: [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ] }
    : {};
  const blogs = await Blog.find(query)
    .populate('author', 'username role createdAt updatedAt')
    .populate({ path: 'comments', populate: { path: 'author', select: 'username role createdAt updatedAt' } })
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));
  const totalBlogs = await Blog.countDocuments(query);
  res.json({ blogs, totalPages: Math.ceil(totalBlogs / limit), currentPage: Number(page), totalBlogs });
});

// Like a blog (user)
router.post('/:id/like', async (req, res) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ message: 'No token provided.' });
  try {
    const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET || 'your_jwt_secret');
    const blog = await Blog.findById(req.params.id);
    if (!blog.likes.includes(decoded.id)) {
      blog.likes.push(decoded.id);
      await blog.save();
    }
    const populatedBlog = await Blog.findById(blog._id)
      .populate('author', 'username role createdAt updatedAt')
      .populate({ path: 'comments', populate: { path: 'author', select: 'username role createdAt updatedAt' } });
    res.json(populatedBlog);
  } catch (err) {
    res.status(401).json({ message: 'Invalid token.' });
  }
});

// Comment on a blog (user)
router.post('/:id/comment', async (req, res) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ message: 'No token provided.' });
  try {
    const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET || 'your_jwt_secret');
    const comment = new Comment({
      content: req.body.content,
      author: decoded.id,
      blog: req.params.id,
    });
    await comment.save();
    const blog = await Blog.findById(req.params.id);
    blog.comments.push(comment._id);
    await blog.save();
    const populatedBlog = await Blog.findById(blog._id)
      .populate('author', 'username role createdAt updatedAt')
      .populate({ path: 'comments', populate: { path: 'author', select: 'username role createdAt updatedAt' } });
    res.json(populatedBlog);
  } catch (err) {
    res.status(401).json({ message: 'Invalid token.' });
  }
});

// Share blog (returns blog URL)
router.get('/:id/share', async (req, res) => {
  res.json({ url: `${req.protocol}://${req.get('host')}/api/blog/${req.params.id}` });
});

module.exports = router;
