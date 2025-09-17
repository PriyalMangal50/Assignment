const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'mern_blog_uploads',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'mp4', 'webm'],
  },
});

const upload = multer({ storage });
const router = express.Router();

// Upload media file to Cloudinary
router.post('/', upload.single('media'), (req, res) => {
  if (!req.file) {
    console.error('No file uploaded:', req.body);
    return res.status(400).json({ message: 'No file uploaded.' });
  }
  try {
    res.json({ url: req.file.path });
  } catch (err) {
    console.error('Cloudinary upload error:', err);
    res.status(500).json({ message: 'Failed to upload media', error: err.message });
  }
});

module.exports = router;
