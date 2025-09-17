require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

// Auth routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// Other routes
// Cloudinary route removed
const adminRoutes = require('./routes/admin');
app.use('/api/admin', adminRoutes);
const uploadRoutes = require('./routes/upload');
app.use('/api/upload', uploadRoutes);
app.use('/uploads', express.static(__dirname + '/uploads'));
const userRoutes = require('./routes/user');
app.use('/api/user', userRoutes);
const blogRoutes = require('./routes/blog');
app.use('/api/blog', blogRoutes);

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/mern_blog', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', async () => {
  console.log('Connected to MongoDB');
  // Auto-create admin user if not exists
  const User = require('./models/User');
  const bcrypt = require('bcryptjs');
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@gmail.com';
  const adminPassword = process.env.ADMIN_PASSWORD || '12345678';
  const admin = await User.findOne({ username: adminEmail });
  if (!admin) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    await User.create({ username: adminEmail, password: hashedPassword, role: 'admin' });
    console.log('Default admin user created: admin@gmail.com / 12345678');
  }
});

// Placeholder route
app.get('/', (req, res) => {
  res.send('MERN Blog Backend Running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
