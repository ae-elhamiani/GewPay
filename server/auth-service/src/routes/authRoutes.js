const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

/**
 * @swagger
 * /auth/nonce:
 *   post:
 *     summary: Generate a nonce for wallet authentication
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - walletAddress
 *             properties:
 *               walletAddress:
 *                 type: string
 *                 description: The wallet address of the user
 *     responses:
 *       200:
 *         description: Nonce generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 nonce:
 *                   type: string
 *       400:
 *         description: Invalid input
 */
router.post('/nonce', authController.getNonce);

/**
 * @swagger
 * /auth/verify:
 *   post:
 *     summary: Verify signed nonce and authenticate user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - walletAddress
 *               - signedNonce
 *             properties:
 *               walletAddress:
 *                 type: string
 *                 description: The wallet address of the user
 *               signedNonce:
 *                 type: string
 *                 description: The nonce signed by the user's wallet
 *     responses:
 *       200:
 *         description: Authentication successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token for authenticated session
 *       401:
 *         description: Authentication failed
 */
router.post('/verify', authController.verifySignature);

module.exports = router;