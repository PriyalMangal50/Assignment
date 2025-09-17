const express = require('express');
const jwt = require('jsonwebtoken');
const Blog = require('../models/Blog');
const Comment = require('../models/Comment');
const verifyAdmin = require('../middleware/verifyAdmin'); // Import the middleware

const router = express.Router();

// --- ADMIN-ONLY ROUTES ---

// CREATE a new blog
router.post('/', verifyAdmin, async (req, res) => {
  try {
    const { title, description, mediaUrl } = req.body;
    const blog = await Blog.create({ title, description, mediaUrl, author: req.user.id });
    res.status(201).json(blog);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// UPDATE a blog
router.put('/:id', verifyAdmin, async (req, res) => {
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedBlog) return res.status(404).json({ message: 'Blog not found' });
    res.json(updatedBlog);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE a blog
router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    res.json({ message: 'Blog deleted successfully.' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


// --- PUBLIC & USER ROUTES ---

// GET all blogs
router.get('/', async (req, res) => {
  // ... your existing get logic ...
  const { page = 1, limit = 10, search = '' } = req.query;
  const query = search ? { $or: [{ title: { $regex: search, $options: 'i' } }, { description: { $regex: search, $options: 'i' } }] } : {};
  try {
    const blogs = await Blog.find(query).populate('author', 'username').sort({ createdAt: -1 }).skip((page - 1) * limit).limit(Number(limit));
    const totalBlogs = await Blog.countDocuments(query);
    res.json({ blogs, totalPages: Math.ceil(totalBlogs / limit), currentPage: Number(page) });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch blogs' });
  }
});

// LIKE a blog
router.post('/:id/like', async (req, res) => {
  // ... your existing like logic ...
});

// COMMENT on a blog
router.post('/:id/comment', async (req, res) => {
  // ... your existing comment logic ...
});

module.exports = router;