const express = require('express');
const paymentController = require('../controllers/paymentController');

const router = express.Router();

router.post('/create-payment', paymentController.createPayment);
router.post('/payment-webhook', paymentController.updatePaymentStatus);

module.exports = router;