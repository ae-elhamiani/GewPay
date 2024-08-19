require('dotenv').config();

module.exports = {
  port: process.env.PORT || 5010,
  redisHost: process.env.REDIS_HOST || 'redis',
  redisPort: process.env.REDIS_PORT || 6379,
  jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
  consulHost: process.env.CONSUL_HOST,
  consulPort: process.env.CONSUL_PORT || 8500
};