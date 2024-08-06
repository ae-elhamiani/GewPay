const notificationService = require('../services/notificationService');


exports.getNotificationsByEmail = async (req, res) => {
  try {
    const notifications = await notificationService.getNotificationsByEmail(req.params.email);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateNotificationStatus = async (req, res) => {
  try {
    const updatedNotification = await notificationService.updateNotificationStatus(req.params.id, req.body.sent);
    res.json(updatedNotification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};