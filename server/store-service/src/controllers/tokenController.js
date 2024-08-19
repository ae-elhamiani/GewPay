const tokenService = require('../services/tokenService');

exports.getAllTokens = async (req, res, next) => {
  try {
    const tokens = await tokenService.getAllTokens();
    res.status(200).json(tokens);
  } catch (error) {
    next(error);
  }
};

exports.getTokensByAddresses = async (req, res, next) => {
  try {
    const { addresses } = req.body;
    if (!addresses || !Array.isArray(addresses)) {
      return res.status(400).json({ message: 'Invalid addresses provided' });
    }
    const tokens = await tokenService.getTokensByAddresses(addresses);
    res.status(200).json(tokens);
  } catch (error) {
    next(error);
  }
};