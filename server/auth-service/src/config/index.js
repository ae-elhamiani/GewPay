require('dotenv').config();

module.exports = {
  port: process.env.PORT || 5001,
  mongoURI: process.env.MONGO_URI || 'mongodb://mongodb:27017/auth_db',
  jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
  consulHost: process.env.CONSUL_HOST,
  consulPort: process.env.CONSUL_PORT || 8500
};