const express = require('express');
const merchantController = require('../controllers/merchantController');

const router = express.Router();

router.post('/register', merchantController.registerMerchant);
router.post('/profile', merchantController.updateProfile);
router.post('/email', merchantController.addEmail);
router.post('/verify-email', merchantController.verifyEmail);
router.post('/phone', merchantController.addPhone);
router.post('/verify-phone', merchantController.verifyPhone);
router.post('/login', merchantController.login);

module.exports = router;
