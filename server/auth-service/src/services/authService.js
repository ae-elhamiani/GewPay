const jwt = require('jsonwebtoken');
const ethers = require('ethers');
const redisClient = require('../utils/redisClient');
const config = require('../config');

exports.generateNonce = async (address) => {
  const nonce = Math.floor(Math.random() * 1000000).toString();
  await redisClient.set(`nonce:${address}`, nonce, 'EX', 300); 
  return nonce;
};

exports.verifySignatureAndGenerateToken = async (address, signature) => {
  const nonce = await redisClient.get(`nonce:${address}`);
  if (!nonce) {
    throw new Error('Nonce not found or expired');
  }

  const message = `Please sign this nonce to authenticate: ${nonce}`;
  const signerAddress = ethers.utils.verifyMessage(message, signature);

  if (signerAddress.toLowerCase() !== address.toLowerCase()) {
    throw new Error('Invalid signature');
  }

  const token = jwt.sign({ address }, config.jwtSecret, { expiresIn: config.jwtExpiresIn });

  // Remove the used nonce
  await redisClient.del(`nonce:${address}`);

  return token;
};