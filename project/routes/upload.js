const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const verifyAdmin = require('../middleware/verifyAdmin'); // Import the middleware

const router = express.Router();

const uploadsDir = path.join(__dirname, '..', 'uploads');

// Ensure the uploads directory exists
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure storage for Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// The upload route, now protected so only admins can upload
router.post('/', verifyAdmin, upload.single('media'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file was uploaded.' });
  }
  // Return the server-relative path. The frontend will construct the full URL.
  res.json({ url: `/uploads/${req.file.filename}` });
});

module.exports = router;