const mongoose = require('mongoose');

const KYCStatus = {
  PENDING: 'PENDING',
  VERIFIED: 'VERIFIED',
  REJECTED: 'REJECTED'
};

const KYCRecordSchema = new mongoose.Schema({
  merchantId: { type: String, required: true, unique: true },
  fullName: String,
  dateOfBirth: String,
  documentNumber: String,
  documentType: String,
  expiryDate: String,
  address: String,
  status: { type: String, enum: Object.values(KYCStatus), default: KYCStatus.PENDING },
  verifiedAt: Date
}, { timestamps: true });

const KYCRecord = mongoose.model('KYCRecord', KYCRecordSchema);

module.exports = { KYCRecord, KYCStatus };