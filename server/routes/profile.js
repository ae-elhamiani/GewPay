const express = require('express');
const User = require('../models/User');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadsDir = path.join(__dirname, '..', 'uploads');
    // Ensure the uploads directory exists
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('Upload directory:', uploadsDir);
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueFilename =
      Date.now() +
      '-' +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);
    console.log('Generated filename:', uniqueFilename);
    cb(null, uniqueFilename);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(
        new Error('Invalid file type. Only JPEG, PNG and GIF are allowed.'),
        false
      );
    }
    cb(null, true);
  },
});

router.post('/save-profile', upload.single('photo'), async (req, res) => {
  console.log('Received save-profile request');
  console.log('Request body:', req.body);
  console.log('File:', req.file);

  const { name, country, walletAddress } = req.body;
  const photoName = req.file ? req.file.filename : null;

  if (!name || !country || !walletAddress) {
    return res
      .status(400)
      .json({
        success: false,
        message: 'Name, country, and wallet address are required',
      });
  }

  try {
    let user = await User.findById(walletAddress);
    if (!user) {
      console.log('Creating new user');
      user = new User({ _id: walletAddress, name, country, photo: photoName });
    } else {
      console.log('Updating existing user');
      user.name = name;
      user.country = country;
      if (photoName) {
        user.photo = photoName;
      }
    }
    await user.save();
    console.log('User saved successfully:', user);
    res.status(200).json({
      success: true,
      message: 'Profile data saved successfully',
      user: {
        name: user.name,
        country: user.country,
        photo: user.photo,
      },
    });
  } catch (error) {
    console.error('Error saving profile data:', error);
    res
      .status(500)
      .json({
        success: false,
        message: 'Failed to save profile data',
        error: error.message,
      });
  }
});

module.exports = router;
