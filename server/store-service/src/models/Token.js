const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
  symbol: { type: String, required: true, unique: true, uppercase: true },
  name: { type: String, required: true },
  addressToken: { type: String, required: true, unique: true },
  logo: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  decimals: { type: Number, required: true, default: 18 },
  chainId: { type: Number, required: true }
}, { timestamps: true });


const Token = mongoose.model('Token', tokenSchema);

module.exports = Token;