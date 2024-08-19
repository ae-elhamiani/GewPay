const Token = require('../models/Token');

exports.getAllTokens = async () => {
  return await Token.find();
};

exports.getTokensByAddresses = async (addresses) => {
  return await Token.find({ addressToken: { $in: addresses } });
};

exports.seedTokens = async (mockTokens) => {
  for (const tokenData of mockTokens) {
    try {
      const existingToken = await Token.findOne({ symbol: tokenData.symbol, chainId: tokenData.chainId });
      if (existingToken) {
        console.log(`Token ${tokenData.symbol} already exists. Skipping...`);
      } else {
        console.log(`Creating new token: ${tokenData.symbol}`);
        await Token.create(tokenData);
      }
    } catch (error) {
      console.error(`Error processing token ${tokenData.symbol}:`, error);
    }
  }
  console.log('Token seeding completed');
};