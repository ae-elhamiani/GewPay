const express = require('express');
const storeController = require('../controllers/storeController');



const router = express.Router();

/**
 * @swagger
 * /create:
 *   post:
 *     summary: Create a new store
 *     tags: [Store]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - address
 *               - blockchainStoreId
 *             properties:
 *               address:
 *                 type: string
 *               blockchainStoreId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Store created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 storeId:
 *                   type: string
 */
router.post('/create', storeController.createStore);

/**
 * @swagger
 * /get/{storeId}:
 *   get:
 *     summary: Get store details
 *     tags: [Store]
 *     parameters:
 *       - in: path
 *         name: storeId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Store details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 merchantId:
 *                   type: string
 *                 blockchainStoreId:
 *                   type: string
 */
router.get('/get/:storeId', storeController.getStore);

/**
 * @swagger
 * /rotate-api-key/{storeId}:
 *   post:
 *     summary: Rotate API key for a store
 *     tags: [Store]
 *     parameters:
 *       - in: path
 *         name: storeId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - oldApiKey
 *             properties:
 *               oldApiKey:
 *                 type: string
 *     responses:
 *       200:
 *         description: API key rotated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 apiKey:
 *                   type: string
 */
router.post('/rotate-api-key/:storeId', storeController.rotateApiKey);

/**
 * @swagger
 * /api-key/{storeId}:
 *   post:
 *     summary: Generate API key for a store
 *     tags: [Store]
 *     parameters:
 *       - in: path
 *         name: storeId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: API key generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 apiKey:
 *                   type: string
 */
router.post('/api-key/:storeId/', storeController.generateApiKey);

/**
 * @swagger
 * /validate-api-key:
 *   post:
 *     summary: Validate an API key
 *     tags: [Store]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - storeId
 *               - apiKey
 *             properties:
 *               storeId:
 *                 type: string
 *               apiKey:
 *                 type: string
 *     responses:
 *       200:
 *         description: API key validation result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isValid:
 *                   type: boolean
 *                 storeId:
 *                   type: string
 */
router.post('/validate-api-key', storeController.validateApiKey);


module.exports = router;