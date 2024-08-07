const Notification = require('../models/notification');

exports.getNotificationsByEmail = async (email) => {
  return Notification.find({ email });
};

exports.deleteNotification = async (id) => {
  return Notification.findByIdAndDelete(id);
};

exports.updateNotificationStatus = async (id, sent) => {
  return Notification.findByIdAndUpdate(id, { sent }, { new: true });
};