const express = require('express');
const otpController = require('../controllers/otpController');

const router = express.Router();

/**
 * @swagger
 * /otp/generate:
 *   post:
 *     summary: Generate a new OTP
 *     tags: [OTP]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - secretKey
 *             properties:
 *               secretKey:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 otp:
 *                   type: string
 *       429:
 *         description: Too many OTP generation attempts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Server error
 */
router.post('/generate', otpController.generateOtp);

/**
 * @swagger
 * /otp/verify:
 *   post:
 *     summary: Verify an OTP
 *     tags: [OTP]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - secretKey
 *               - userInput
 *             properties:
 *               secretKey:
 *                 type: string
 *               userInput:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP verification result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: string
 *       500:
 *         description: Server error
 */
router.post('/verify', otpController.verifyOtp);

module.exports = router;