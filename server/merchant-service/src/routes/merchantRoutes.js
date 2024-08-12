const express = require('express');
const merchantController = require('../controllers/merchantController');
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Merchant:
 *       type: object
 *       required:
 *         - address
 *       properties:
 *         address:
 *           type: string
 *         username:
 *           type: string
 *         businessActivity:
 *           type: string
 *         image:
 *           type: string
 *         email:
 *           type: string
 *         phone:
 *           type: string
 *         registrationStep:
 *           type: string
 *           enum: [INITIAL, PROFILE, EMAIL, VERIFY_EMAIL, PHONE, VERIFY_PHONE, COMPLETE]
 */

/**
 * @swagger
 * /merchant/register:
 *   post:
 *     summary: Register a new merchant
 *     tags: [Merchant]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - address
 *             properties:
 *               address:
 *                 type: string
 *     responses:
 *       201:
 *         description: Merchant registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 merchantId:
 *                   type: string
 *                 step:
 *                   type: string
 *       400:
 *         description: Invalid input
 *       409:
 *         description: Merchant with this address already exists
 *       500:
 *         description: Server error
 */
router.post('/register', merchantController.registerMerchant);

/**
 * @swagger
 * /merchant/profile:
 *   post:
 *     summary: Update merchant profile
 *     tags: [Merchant]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - address
 *               - username
 *               - businessActivity
 *             properties:
 *               address:
 *                 type: string
 *               username:
 *                 type: string
 *               businessActivity:
 *                 type: string
 *               image:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 step:
 *                   type: string
 *       404:
 *         description: Merchant not found
 *       500:
 *         description: Server error
 */
router.post('/profile', merchantController.updateProfile);

/**
 * @swagger
 * /merchant/email:
 *   post:
 *     summary: Add email to merchant profile
 *     tags: [Merchant]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - address
 *               - email
 *             properties:
 *               address:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Email added successfully and verification OTP sent
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 step:
 *                   type: string
 *       500:
 *         description: Server error
 */
router.post('/email', merchantController.addEmail);

/**
 * @swagger
 * /merchant/verify-email:
 *   post:
 *     summary: Verify merchant email
 *     tags: [Merchant]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - address
 *               - otp
 *             properties:
 *               address:
 *                 type: string
 *               otp:
 *                 type: string
 *     responses:
 *       200:
 *         description: Email verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 step:
 *                   type: string
 *       400:
 *         description: Invalid OTP
 *       500:
 *         description: Server error
 */
router.post('/verify-email', merchantController.verifyEmail);

/**
 * @swagger
 * /merchant/phone:
 *   post:
 *     summary: Add phone to merchant profile
 *     tags: [Merchant]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - address
 *               - phone
 *             properties:
 *               address:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Phone added successfully and verification OTP sent
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 step:
 *                   type: string
 *       500:
 *         description: Server error
 */
router.post('/phone', merchantController.addPhone);

/**
 * @swagger
 * /merchant/verify-phone:
 *   post:
 *     summary: Verify merchant phone
 *     tags: [Merchant]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - address
 *               - otp
 *             properties:
 *               address:
 *                 type: string
 *               otp:
 *                 type: string
 *     responses:
 *       200:
 *         description: Phone verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 step:
 *                   type: string
 *       400:
 *         description: Invalid OTP
 *       500:
 *         description: Server error
 */
router.post('/verify-phone', merchantController.verifyPhone);

/**
 * @swagger
 * /merchant/login:
 *   post:
 *     summary: Merchant login
 *     tags: [Merchant]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - address
 *             properties:
 *               address:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - type: object
 *                   properties:
 *                     redirect:
 *                       type: string
 *                 - type: object
 *                   properties:
 *                     step:
 *                       type: string
 *       404:
 *         description: Merchant not found
 *       500:
 *         description: Server error
 */
router.post('/login', merchantController.login);

module.exports = router;