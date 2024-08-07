const nodemailer = require('nodemailer');
const EmailTemplate = require('../models/emailTemplate');
const Notification = require('../models/notification');
const thymeleafService = require('./thymeleafService');
const config = require('../config');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

exports.sendEmail = async (toEmail, category, variables) => {
  try {
    const template = await EmailTemplate.findOne({ category, defaultTemplate: true }).sort('-version');
    if (!template) {
      throw new Error(`Template not found for category: ${category}`);
    }

    const htmlContent = thymeleafService.createContent(template.content, variables);

    await transporter.sendMail({
      to: toEmail,
      subject: template.subject,
      html: htmlContent
    });

    await Notification.create({
      email: toEmail,
      templateName: template.name,
      sent: true
    });
  } catch (error) {
    console.error('Failed to send email', error);
    await Notification.create({
      email: toEmail,
      exception: `Failed: ${error.message}`,
      sent: false
    });
  }
};

exports.sendBulkEmail = async (toEmails, templateCategory, variables) => {
  for (const email of toEmails) {
    await this.sendEmail(email, templateCategory, variables);
  }
};