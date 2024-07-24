const authService = require('../services/authService');

exports.getNonce = async (req, res, next) => {
  try {
    const { address } = req.body;
    const nonce = await authService.generateNonce(address);
    res.json({ nonce });
  } catch (error) {
    next(error);
  }
};

exports.verifySignature = async (req, res, next) => {
  try {
    const { address, signature } = req.body;
    const token = await authService.verifySignatureAndGenerateToken(address, signature);
    res.json({ token });
  } catch (error) {
    next(error);
  }
};