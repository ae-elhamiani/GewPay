const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  storeName: { type: String, required: true },
  merchantId: { type: String, required: true },
  blockchainStoreId: { type: String, required: true },
  apiKey: { type: String, unique: true, sparse: true },
  apiKeyLastUsed: { type: Date },
  apiKeyUsageCount: { type: Number, default: 0 },
}, { timestamps: true });


module.exports = mongoose.model('Store', storeSchema);