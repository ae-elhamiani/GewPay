const express = require('express');
const storeController = require('../controllers/storeController');
const tokenController = require('../controllers/tokenController');

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
router.post('/api-key/:storeId', storeController.generateApiKey);

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

/**
 * @swagger
 * /tokens:
 *   get:
 *     summary: Get all tokens
 *     tags: [Token]
 *     responses:
 *       200:
 *         description: List of all tokens
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   symbol:
 *                     type: string
 *                   name:
 *                     type: string
 *                   addressToken:
 *                     type: string
 *                   logo:
 *                     type: string
 *                   chainId:
 *                     type: number
 *                   decimals:
 *                     type: number
 */
router.get('/tokens', tokenController.getAllTokens);

/**
 * @swagger
 * /tokens/byAddresses:
 *   post:
 *     summary: Get tokens by addresses
 *     tags: [Token]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - addresses
 *             properties:
 *               addresses:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: List of tokens matching the provided addresses
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   symbol:
 *                     type: string
 *                   name:
 *                     type: string
 *                   addressToken:
 *                     type: string
 *                   logo:
 *                     type: string
 *                   chainId:
 *                     type: number
 *                   decimals:
 *                     type: number
 *       400:
 *         description: Invalid addresses provided
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.post('/tokens/byAddresses', tokenController.getTokensByAddresses);

/**
 * @swagger
 * /merchant/{merchantId}:
 *   get:
 *     summary: Get all stores for a merchant
 *     tags: [Store]
 *     parameters:
 *       - in: path
 *         name: merchantId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of stores for the merchant
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   storeName:
 *                     type: string
 *                   merchantId:
 *                     type: string
 *                   blockchainStoreId:
 *                     type: string
 *                   apiKey:
 *                     type: string
 *                   apiKeyLastUsed:
 *                     type: string
 *                     format: date-time
 *                   apiKeyUsageCount:
 *                     type: number
 *                   todayStats:
 *                     type: object
 *                   transactionCount:
 *                     type: number
 *                   transactionVolume:
 *                     type: number
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                   status:
 *                     type: string
 *                     enum: [ACTIVE, 'API KEY ..', NEW]
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.get('/merchant/:merchantId', storeController.getMerchantStores);

/**
 * @swagger
 * /accepted-tokens/{storeId}:
 *   get:
 *     summary: Get accepted tokens for a store
 *     tags: [Store]
 *     parameters:
 *       - in: path
 *         name: storeId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of accepted tokens
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Token'
 */
router.get('/accepted-tokens/:storeId', storeController.getAcceptedTokens);

module.exports = router;
