const emailSenderService = require('../services/emailSenderService');

exports.sendEmail = async (req, res) => {
  try {
    const { toEmail, templateCategory, variables } = req.body;
    await emailSenderService.sendEmail(toEmail, templateCategory, variables);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.sendBulkEmail = async (req, res) => {
  try {
    const { toEmails, templateCategory, variables } = req.body;
    await emailSenderService.sendBulkEmail(toEmails, templateCategory, variables);
    res.status(200).json({ message: 'Bulk emails sent successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};