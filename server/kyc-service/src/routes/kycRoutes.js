const express = require('express');
const multer = require('multer');
const kycController = require('../controllers/kycController');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

/**
 * @swagger
 * /kyc/process:
 *   post:
 *     summary: Process KYC documents
 *     tags: [KYC]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               merchantId:
 *                 type: string
 *               selfie:
 *                 type: string
 *                 format: binary
 *               recto:
 *                 type: string
 *                 format: binary
 *               verso:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: KYC documents processed successfully
 *       500:
 *         description: Server error
 */
router.post('/process', upload.fields([
  { name: 'selfie', maxCount: 1 },
  { name: 'recto', maxCount: 1 },
  { name: 'verso', maxCount: 1 }
]), kycController.processKYCDocuments);

/**
 * @swagger
 * /kyc/submit:
 *   post:
 *     summary: Submit verified KYC data
 *     tags: [KYC]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               merchantId:
 *                 type: string
 *               verifiedData:
 *                 type: object
 *     responses:
 *       200:
 *         description: KYC data submitted successfully
 *       500:
 *         description: Server error
 */
router.post('/submit', kycController.submitKYC);

/**
 * @swagger
 * /kyc/status/{merchantId}:
 *   get:
 *     summary: Get KYC status
 *     tags: [KYC]
 *     parameters:
 *       - in: path
 *         name: merchantId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: KYC status retrieved successfully
 *       404:
 *         description: KYC record not found
 *       500:
 *         description: Server error
 */
router.get('/status/:merchantId', kycController.getKYCStatus);

module.exports = router;