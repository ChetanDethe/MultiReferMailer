const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const multer = require('multer');

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage });

// Sign Up
// router.post('/signup', async (req, res) => {
//   const { firstName, lastName, email, password, appPassword } = req.body;
//   try {
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const hashedAppPassword = await bcrypt.hash(appPassword, 10);
//     const newUser = new User({
//       firstName,
//       lastName,
//       email,
//       password: hashedPassword,
//       appPassword: hashedAppPassword,
//     });
//     await newUser.save();
//     res.status(201).json({ message: 'User created' });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// Sign Up
router.post('/signup', async (req, res) => {
    const { firstName, lastName, email, password, appPassword } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      // Do NOT hash appPassword; store it as plain text
      const newUser = new User({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        appPassword, // Store as plain text
      });
      await newUser.save();
      res.status(201).json({ message: 'User created' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

// Log In
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    res.json({ user: { firstName: user.firstName, lastName: user.lastName, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Fetch User Data
router.get('/user/:email', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Email Template
router.post('/update-template', async (req, res) => {
  const { email, subject, body } = req.body;
  try {
    await User.updateOne({ email }, { emailTemplate: { subject, body } });
    res.json({ message: 'Template updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Upload CV
// router.post('/upload-cv', upload.single('cv'), async (req, res) => {
//   const { email } = req.body;
//   try {
//     await User.updateOne({ email }, { cv: req.file.path });
//     res.json({ message: 'CV uploaded', path: req.file.path });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });


// Upload CV
router.post('/upload-cv', upload.single('cv'), async (req, res) => {
    console.log('Request Body:', req.body); // Log the request body
    console.log('Uploaded File:', req.file); // Log the uploaded file
  
    const { email } = req.body;
  
    // Validate email
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
  
    // Validate file
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
  
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      await User.updateOne({ email }, { cv: req.file.path });
      res.json({ message: 'CV uploaded', path: req.file.path });
    } catch (err) {
      console.error('Error uploading CV:', err); // Log the error for debugging
      res.status(500).json({ error: err.message });
    }
  });

// Remove CV
router.post('/remove-cv', async (req, res) => {
  const { email } = req.body;
  try {
    await User.updateOne({ email }, { cv: '' });
    res.json({ message: 'CV removed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;