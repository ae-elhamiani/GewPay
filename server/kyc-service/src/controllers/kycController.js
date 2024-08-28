const kycService = require('../services/kycService');

exports.processKYCDocuments = async (req, res, next) => {
  try {
    const { merchantId } = req.body;
    const { selfie, recto, verso } = req.files;

    const extractedData = await kycService.processKYCDocuments(
      merchantId,
      selfie[0].buffer,
      recto[0].buffer,
      verso[0].buffer
    );

    res.status(200).json({ extractedData });
  } catch (error) {
    console.error('Error in processKYCDocuments:', error);
    next(error);
  }
};

exports.submitKYC = async (req, res, next) => {
  try {
    const { merchantId, verifiedData } = req.body;
    const kycRecord = await kycService.submitKYC(merchantId, verifiedData);
    res.status(200).json({ status: kycRecord.status });
  } catch (error) {
    console.error('Error in submitKYC:', error);
    next(error);
  }
};

exports.getKYCStatus = async (req, res, next) => {
  try {
    const { merchantId } = req.params;
    const status = await kycService.getKYCStatus(merchantId);
    res.status(200).json({ status });
  } catch (error) {
    console.error('Error in getKYCStatus:', error);
    if (error.message === 'KYC record not found') {
      return res.status(404).json({ error: error.message });
    }
    next(error);
  }
};