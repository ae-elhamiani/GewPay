const jwt = require('jsonwebtoken');
const ethers = require('ethers');
const User = require('../models/User');
const config = require('../config');

exports.generateNonce = async (address) => {
  const nonce = Math.floor(Math.random() * 1000000).toString();
  await User.findOneAndUpdate(
    { address },
    { address, nonce },
    { upsert: true, new: true }
  );
  console.log("feifjdlkjflskhfda;");

  return nonce;
};

exports.verifySignatureAndGenerateToken = async (address, signature) => {
  const user = await User.findOne({ address });
  if (!user) {
    throw new Error('User not found');
  }

  const message = `Please sign this nonce to authenticate: ${user.nonce}`;
  const signerAddress = ethers.utils.verifyMessage(message, signature);
  console.log("feifjdlkjflskhfda;");

  if (signerAddress.toLowerCase() !== address.toLowerCase()) {
    throw new Error('Invalid signature');
  }

  const token = jwt.sign({ address }, config.jwtSecret, { expiresIn: config.jwtExpiresIn });

  // Generate a new nonce for next time
  await this.generateNonce(address);

  return token;
};