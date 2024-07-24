require('dotenv').config();

module.exports = {
  port: process.env.PORT || 5002,
  mongoURI: process.env.MONGO_URI || 'mongodb://localhost:27017/merchant_db',
  jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret',
  consulHost: process.env.CONSUL_HOST || 'consul',
  consulPort: process.env.CONSUL_PORT || 8500
};