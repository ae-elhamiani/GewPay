// routes/orderRoutes.js
const express = require('express');
const orderController = require('../controllers/orderController');

const router = express.Router();

router.post('/orders', orderController.createOrder); // POST /api/orders

// You can define other routes related to orders here

module.exports = router;
