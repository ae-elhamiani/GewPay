const express = require('express');
const merchantController = require('../controllers/merchantController');

const router = express.Router();

router.post('/register', merchantController.registerMerchant);
router.get('/:address', merchantController.getMerchantInfo);
router.put('/:address', merchantController.updateMerchantProfile);

module.exports = router;