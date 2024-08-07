const express = require('express');
const merchantController = require('../controllers/merchantController');

const router = express.Router();

router.post('/register', merchantController.registerMerchant);
router.put('/:merchantId/profile', merchantController.updateProfile);
router.post('/:merchantId/email', merchantController.addEmail);
router.post('/:merchantId/verify-email', merchantController.verifyEmail);
router.post('/:merchantId/phone', merchantController.addPhone);
router.post('/:merchantId/verify-phone', merchantController.verifyPhone);
router.post('/login', merchantController.login);

module.exports = router;
