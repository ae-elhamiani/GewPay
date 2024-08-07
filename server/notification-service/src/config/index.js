require('dotenv').config();

module.exports = {
  port: process.env.PORT || 5003,
  mongoUri: process.env.MONGO_URI || 'mongodb://mongodb:27017/notification_db',
  consulHost: process.env.CONSUL_HOST || 'consul',
  consulPort: process.env.CONSUL_PORT || 8500,
  redisHost: process.env.REDIS_HOST || 'redis',
  redisPort: process.env.REDIS_PORT || 6379,
  smtpHost: process.env.SMTP_HOST,
  smtpPort: process.env.SMTP_PORT || 587,
  smtpUser: process.env.SMTP_USER,
  smtpPass: process.env.SMTP_PASS,
};