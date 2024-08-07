const axios = require('axios');
const { getServiceUrl } = require('./serviceDiscovery');

exports.sendEmail = async (toEmail, templateCategory, variables) => {
    try {
      console.log('Sending email:', { toEmail, templateCategory, variables });
      const notificationServiceUrl = await getServiceUrl('notification-service');
      console.log('Notification service URL:', notificationServiceUrl);
      
      const response = await axios.post(`${notificationServiceUrl}/send-email`, {
        toEmail,
        templateCategory,
        variables
      });
      
      console.log('Email sent successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to send email:', error.message);
      if (error.response) {
        console.error('Error response:', error.response.data);
      }
      throw new Error('Failed to send email');
    }
  };

exports.sendSMS = async (phone, templateCategory, variables) => {
  try {
    const notificationServiceUrl = await getServiceUrl('notification-service');
    await axios.post(`${notificationServiceUrl}/sms`, {
      toPhone: phone,
      templateCategory,
      variables
    });
  } catch (error) {
    console.error('Failed to send SMS:', error);
    throw new Error('Failed to send SMS');
  }
};