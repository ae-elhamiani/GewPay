const { KYCRecord } = require('../models/KYCRecord');
const ocrService = require('./ocrService');

exports.processKYCDocuments = async (merchantId, selfie, rectoImage, versoImage) => {
  try {
    console.log('Processing recto image...');
    const rectoData = await ocrService.processImage(rectoImage);
    console.log('Processing verso image...');
    const versoData = await ocrService.processImage(versoImage);

    console.log('Extracting data...');
    const extractedData = this.extractData(rectoData, versoData);
    console.log('Extracted Data:', JSON.stringify(extractedData, null, 2));

    const kycRecord = new KYCRecord({
      merchantId,
      extractedData,
      status: 'PENDING'
    });
    await kycRecord.save();

    return extractedData;
  } catch (error) {
    console.error('Error in processKYCDocuments:', error);
    throw error;
  } finally {
    await ocrService.terminate();
  }
};

exports.extractData = (rectoData, versoData) => {
  return {
    firstName: this.extractFirstName(rectoData),
    lastName: this.extractLastName(rectoData),
    dateOfBirth: this.extractDateOfBirth(rectoData),
    documentNumber: this.extractDocumentNumber(rectoData),
    expiryDate: this.extractExpiryDate(rectoData),
    address: this.extractAddress(versoData)
  };
};

exports.extractFirstName = (data) => {
  const nameRegex = /PRENOM[\s\S]*?:\s*(\w+)/i;
  const match = data.text.match(nameRegex);
  return match ? match[1] : '';
};

exports.extractLastName = (data) => {
  const nameRegex = /NOM[\s\S]*?:\s*(\w+(?:\s+\w+)*)/i;
  const match = data.text.match(nameRegex);
  return match ? match[1] : '';
};

exports.extractDateOfBirth = (data) => {
  const dobRegex = /DATE DE NAISSANCE[\s\S]*?:\s*(\d{2}\/\d{2}\/\d{4})/i;
  const match = data.text.match(dobRegex);
  return match ? match[1] : '';
};

exports.extractDocumentNumber = (data) => {
  const idRegex = /N[Oo°]\s*:?\s*([A-Z]\d{6,8})/i;
  const match = data.text.match(idRegex);
  return match ? match[1] : '';
};

exports.extractExpiryDate = (data) => {
  const expiryRegex = /VALABLE JUSQU['\s\S]*?(\d{2}\/\d{2}\/\d{4})/i;
  const match = data.text.match(expiryRegex);
  return match ? match[1] : '';
};

exports.extractAddress = (data) => {
  const addressRegex = /ADRESSE[\s\S]*?:\s*([\s\S]+?)(?:\n|$)/i;
  const match = data.text.match(addressRegex);
  return match ? match[1].trim() : '';
};