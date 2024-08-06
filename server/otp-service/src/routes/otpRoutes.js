const express = require('express');
const otpController = require('../controllers/otpController');

const router = express.Router();

router.post('/generate', otpController.generateOtp);
router.post('/verify', otpController.verifyOtp);

module.exports = router;

// src/middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'An unexpected error occurred' });
};