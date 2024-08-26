const express = require('express');
const { getConversion } = require('../controllers/conversionController');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

router.get('/convert', asyncHandler(getConversion));

module.exports = router;